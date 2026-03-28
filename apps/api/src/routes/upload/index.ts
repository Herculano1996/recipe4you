import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../../lib/supabase.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const MAX_FILE_SIZE =
  parseInt(process.env.STORAGE_MAX_FILE_SIZE_MB ?? "10", 10) * 1024 * 1024;

export async function uploadRoutes(app: FastifyInstance): Promise<void> {
  // POST /upload/recipe-image
  app.post(
    "/upload/recipe-image",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const data = await request.file({ limits: { fileSize: MAX_FILE_SIZE } });

      if (!data) {
        return reply
          .status(400)
          .send({ error: { code: "NO_FILE", message: "No file uploaded" } });
      }

      const userId = (request.user as { id: string }).id;
      const ext = data.filename.split(".").pop() ?? "jpg";
      const path = `${userId}/${Date.now()}.${ext}`;

      const buffer = await data.toBuffer();

      const { error } = await supabaseAdmin.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET_RECIPES ?? "recipe-images")
        .upload(path, buffer, { contentType: data.mimetype, upsert: false });

      if (error) {
        return reply
          .status(500)
          .send({ error: { code: "UPLOAD_FAILED", message: error.message } });
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET_RECIPES ?? "recipe-images")
        .getPublicUrl(path);

      return reply.status(201).send({ data: { url: urlData.publicUrl } });
    },
  );

  // POST /upload/avatar
  app.post(
    "/upload/avatar",
    { preHandler: [requireAuth] },
    async (request, reply) => {
      const data = await request.file({
        limits: { fileSize: 5 * 1024 * 1024 },
      }); // 5MB max for avatars

      if (!data) {
        return reply
          .status(400)
          .send({ error: { code: "NO_FILE", message: "No file uploaded" } });
      }

      const userId = (request.user as { id: string }).id;
      const ext = data.filename.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar.${ext}`;

      const buffer = await data.toBuffer();

      const { error } = await supabaseAdmin.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET_AVATARS ?? "avatars")
        .upload(path, buffer, { contentType: data.mimetype, upsert: true });

      if (error) {
        return reply
          .status(500)
          .send({ error: { code: "UPLOAD_FAILED", message: error.message } });
      }

      const { data: urlData } = supabaseAdmin.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET_AVATARS ?? "avatars")
        .getPublicUrl(path);

      return reply.status(201).send({ data: { url: urlData.publicUrl } });
    },
  );
}
