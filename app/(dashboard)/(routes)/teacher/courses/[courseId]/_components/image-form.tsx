"use client";

import * as z from "zod";
import axios from "axios";
import { Course } from "@prisma/client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
   initialData: Course;
}

const formSchema = z.object({
   imageURL: z.string().min(1, {
      message: "Image is required",
   }),
});

export const ImageForm = ({
   initialData
}: ImageFormProps) => {
   const router = useRouter();
   const [isEditing, setIsEditing] = useState(false);

   const toggleEdit = () => setIsEditing((current) => !current);

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
            Course Image
            <Button variant="ghost" onClick={toggleEdit}>
               {isEditing && (
                  <>Cancel</>
               )}
               {!isEditing && (
                  !initialData.imageURL ? (
                     <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Image
                     </>
                  ) : (
                     <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Image
                     </>
                  )
               )}
            </Button>
         </div>
         {!isEditing && (
            !initialData.imageURL ? (
               <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                  <ImageIcon className="h-10 w-10 text-slate-500" />
               </div>
            ) : (
               <div className="relative aspect-video mt-2">
                  <Image
                     alt="Upload"
                     fill
                     className="object-cover rounded-md"
                     src={initialData.imageURL}
                  />
               </div>
            )
         )}
         {isEditing && (
            <div>
               <FileUpload
                  endpoint="courseImage"
                  onChange={(url) => {
                     if (url) {
                        onSubmit({ imageURL: url });
                     }
                  }} />
                  <div className="text-xs text-muted-foreground mt-4">
                     16:9 aspect ratio recommended
                  </div>
            </div>
         )}
      </div>
   );
};;