import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getVisitorId(): string {
  // Fungsi ini hanya akan berjalan di browser
  // jadi aman untuk menggunakan localStorage
  let visitorId = localStorage.getItem('visitorId');

  if (!visitorId) {
    visitorId = crypto.randomUUID(); // Membuat ID unik baru
    localStorage.setItem('visitorId', visitorId);
  }

  return visitorId;
}