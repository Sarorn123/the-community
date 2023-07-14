import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || ""
const api_key = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || ""
const supabase = createClient(url, api_key, {
        auth: {
                persistSession: false
        }
})

const bucket_name = "post_image"

export async function uploadFileToSupabase(file: File) {
        const path = Date.now() + "_" + file.name

        const { data, error } = await supabase.storage
                .from(bucket_name)
                .upload(path, file)
        if (error) {
                console.log(error)
                return ""
        } else {
                const url = supabase.storage
                        .from(bucket_name)
                        .getPublicUrl(data.path)
                return url.data.publicUrl
        }
}

export async function deleteFileFromSupabase(url: string) {
        const path = url.split("/")[8];

        console.log(path)

        const { data, error } = await supabase.storage
                .from(bucket_name)
                .remove([path])
        if (error) {
                console.log(error)
                return ""
        }
        console.log(data)
}

// allow bucket can insert file
// https://stackoverflow.com/questions/72861584/supabase-bucket-policy-to-insert-file-not-working
