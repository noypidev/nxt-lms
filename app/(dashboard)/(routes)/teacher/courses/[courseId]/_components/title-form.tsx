"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface TitleFormProps {
   initialData: {
      id: string;
      title: string;
   };
}

const formSchema = z.object({
   title: z.string().min(1, {
      message: "Title is required",
   }),
});

export const TitleForm = ({
   initialData
}: TitleFormProps) => {
   const router = useRouter();
   const [ isEditing, setIsEditing ] = useState(false);

   const toggleEdit = () => setIsEditing((current) => !current);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: initialData
   });

   const { isSubmitting, isValid } = form.formState;

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
         await axios.patch(`/api/courses/${ initialData.id }`, values);
         toast.success("Course updated!");
         toggleEdit();
         router.refresh();
      } catch (error) {
         toast.error("Something went wrong.");
      }
   };

   return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4">
         <div className="font-medium flex items-center justify-between">
            Course Title
            <Button variant="ghost" onClick={toggleEdit}>
               {isEditing ? (
                  <>Cancel</>
               ) : (
                  <>
                     <Pencil className="h-4 w-4 mr-2" />
                     Edit Title
                  </>
               )}
            </Button>
         </div>
         {!isEditing ? (
            <p className="text-sm mt-2">
               {initialData.title}
            </p>
         ) : (
            <>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-4 mt-4">
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormControl>
                                 <Input
                                    disabled={isSubmitting}
                                    placeholder="e.g. 'Advanced Web Development'"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="flex items-center gap-x-2">
                        <Button
                           disabled={!isValid || isSubmitting}
                           type="submit">
                           Save
                        </Button>
                     </div>
                  </form>
               </Form>
            </>
         )}
      </div>
   );
};