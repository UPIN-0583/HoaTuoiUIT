export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD") // tách dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/[^a-z0-9\s-]/g, "") // bỏ ký tự không hợp lệ
    .trim()
    .replace(/\s+/g, "-"); // chuyển khoảng trắng thành dấu gạch ngang
}