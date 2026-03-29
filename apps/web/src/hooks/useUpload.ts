import { useMutation } from "@tanstack/react-query";

interface UploadResult {
  url: string;
}

async function uploadFile(endpoint: string, file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("auth_token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;

  const res = await fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Upload failed");
  }

  const json = (await res.json()) as { data: UploadResult };
  return json.data;
}

export function useUploadRecipeImage() {
  return useMutation({
    mutationFn: (file: File) => uploadFile("/upload/recipe-image", file),
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: (file: File) => uploadFile("/upload/avatar", file),
  });
}
