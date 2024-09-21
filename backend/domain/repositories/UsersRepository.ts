import type { CreateUserDTO, TrackMediaUserDTO } from "../dtos";
import type { User } from "../entities";

export abstract class UsersRepository {
	abstract create(data: CreateUserDTO): Promise<User>;
	abstract findByEmail(email: string): Promise<User | null | undefined>;
	abstract getTimeSpent(email: string, categories?: string[]): Promise<number>;
	abstract track(data: TrackMediaUserDTO): Promise<void>;
}
