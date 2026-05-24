const ADMIN_HEADER = "x-nacho-admin";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "queso";
}

export function isAdminAuthorised(req: Request): boolean {
  const supplied = req.headers.get(ADMIN_HEADER);
  if (!supplied) return false;
  return supplied === getAdminPassword();
}

export const ADMIN_HEADER_NAME = ADMIN_HEADER;
