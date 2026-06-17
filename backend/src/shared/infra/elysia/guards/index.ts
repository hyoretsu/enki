import { HttpException } from "@/shared/errors";
import { auth } from "@/shared/infra/betterAuth";

export const authGuard = async (headers: any): Promise<{ userId: string }> => {
	const session = await auth.api.getSession({ headers });
	if (!session) {
		throw new HttpException("Unauthorized.", 401);
	}

	return { userId: session.user.id };
};
