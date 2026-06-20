import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string({ message: 'Nama wajib diisi.' })
      .min(3, 'Nama karakter harus 3 hingga 20 huruf.')
      .max(20, 'Nama karakter harus 3 hingga 20 huruf.')
      .trim(),
    password: z
      .string({ message: 'Kata sandi wajib diisi.' })
      .min(6, 'Kata sandi minimal 6 karakter.'),
    inviteCode: z
      .string({ message: 'Tiket undangan wajib diisi.' })
      .min(1, 'Tiket undangan wajib diisi.')
      .trim()
  })
});

export const loginSchema = z.object({
  body: z.object({
    username: z
      .string({ message: 'Nama wajib diisi.' })
      .min(1, 'Nama wajib diisi.')
      .trim(),
    password: z
      .string({ message: 'Sandi wajib diisi.' })
      .min(1, 'Sandi wajib diisi.')
  })
});

// Inferensi Tipe TypeScript agar sinkron dengan Skema Zod
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
