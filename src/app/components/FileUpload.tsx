"use client";
import { uploadToS3 } from "@/app/lib/s3";

import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
    const {getRootProps, getInputProps } = useDropzone();
  return <div className="p-2 bg-white rounded-xl">
    <div {...getRootProps({
      className: "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
    })}>
      <input {...getInputProps()}/>
    </div>
  </div>
};

export default FileUpload;
