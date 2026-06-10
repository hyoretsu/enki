import { HttpException } from "@enki/domain";
import { auth } from "~/sql/betterAuth";

export const authGuard = async (headers: any): Promise<{ userId: string }> => {
	const session = await auth.api.getSession({ headers });
	if (!session) {
		throw new HttpException("Unauthorized.", 401);
	}

	return { userId: session.user.id };
};
