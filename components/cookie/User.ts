import { cookies } from "next/headers";

type StoredUser = {
    name: string;
    username: string;
    password: string;
};

const COOKIE_NAME = "fakeUser";

export async function getUserFromCookie() {
    const cookieStore = await cookies();
    const raw = cookieStore.get(COOKIE_NAME)?.value;

    if (!raw) return null;

    try {
        const value = decodeURIComponent(raw);
        return JSON.parse(value) as StoredUser;
    } catch {
        return null;
    }
}