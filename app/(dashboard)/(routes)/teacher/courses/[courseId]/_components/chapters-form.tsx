"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Loader2, Pencil, PlusCircle } from "lucide-react";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import ChaptersList from "./chapters-list";

interface ChaptersFormProps {
   course: Course & { chapters: Chapter[]; };
}

const formSchema = z.object({
   title: z.string().min(1, {
      message: "Title is required",
   }),
});

export const ChaptersForm = ({
   course
}: ChaptersFormProps) => {
   const router = useRouter();
   const [isCreating, setIsCreating] = useState(false);
   const [isUpdating, setIsUpdating] = useState(false);

   const toggleCreating = () => setIsCreating((current) => !current);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         title: ""
      }
   });

   const { isSubmitting, isValid } = form.formState;

   const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
         await axios.post(`/api/courses/${ course.id }/chapters`, values);
         toast.success("Chapter created!");
         toggleCreating();
         router.refresh();
      } catch (error) {
         toast.error("Something went wrong.");
      }
   };

   const onEdit = (id: string) => {
      router.push(`/teacher/courses/${ course.id }/chapters/${ id }`);
   };

   const onReorder = async (updateData: { id: string; position: number; }[]) => {
      try {
         setIsUpdating(true);

         await axios.put(`/api/courses/${ course.id }/chapters/reorder`, {
            list: updateData
         });
         toast.success("Chapters reordered");
         router.refresh();
      } catch (error) {
         toast.error("Someting went wrong.");
      } finally {
         setIsUpdating(false);
      }
   };

   return (
      <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
         {isUpdating && (
            <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
               <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
            </div>
         )}
         <div className="font-medium flex items-center justify-between">
            Course Chapters
            <Button variant="ghost" onClick={toggleCreating}>
               {isCreating ? (
                  <>Cancel</>
               ) : (
                  <>
                     <PlusCircle className="h-4 w-4 mr-2" />
                     Add a Chapter
                  </>
               )}
            </Button>
         </div>
         {!isCreating ? (
            <>
               <div className={cn(
                  "text-sm mt-2",
                  !course.chapters.length && "text-slate-500 italic"
               )}>
                  {!course.chapters.length && "No chapters available"}
                  <ChaptersList
                     onEdit={onEdit}
                     onReorder={onReorder}
                     items={course.chapters || []}
                  />
               </div>
               <p className="text-xs text-muted-foreground mt-4">
                  Drag and drop to reorder the chapters
               </p>
            </>
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
                                    placeholder="e.g. 'Introduction to the course...'"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {/* <div className="flex items-center gap-x-2"> */}
                     <Button
                        disabled={!isValid || isSubmitting}
                        type="submit">
                        Create
                     </Button>
                     {/* </div> */}
                  </form>
               </Form>
            </>
         )}
      </div>
   );
};