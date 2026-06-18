import type { TrackMediaUserDTO, TrackVideoGamePlaythroughDTO } from "@/shared/dtos";
import type { User } from "@/shared/types";

export abstract class UsersRepository {
	abstract findByEmail(email: string): Promise<User | null | undefined>;
	abstract findById(id: string): Promise<User | null | undefined>;
	abstract getTimeSpent(id: string, categories?: string[]): Promise<number>;
	abstract track(data: TrackMediaUserDTO): Promise<void>;
	abstract trackPlaythrough(data: TrackVideoGamePlaythroughDTO): Promise<void>;
}
