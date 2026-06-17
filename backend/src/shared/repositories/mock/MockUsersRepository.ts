import type { TrackMediaUserDTO, TrackVideoGamePlaythroughDTO } from "@/shared/dtos";
import type { UsersRepository } from "@/shared/repositories";
import type { User } from "@/shared/types";

/** In-memory UsersRepository for DB-free unit tests. */
export class MockUsersRepository implements UsersRepository {
	public users: User[] = [];
	public tracked: TrackMediaUserDTO[] = [];
	public trackedRuns: TrackVideoGamePlaythroughDTO[] = [];
	public timeSpent = 0;

	public seedUser(partial: Partial<User> = {}): User {
		const user: User = {
			createdAt: new Date(),
			email: partial.email ?? "user@enki.test",
			emailVerified: true,
			id: partial.id ?? "user-1",
			image: null,
			name: partial.name ?? "Test User",
			updatedAt: new Date(),
			...partial,
		};
		this.users.push(user);
		return user;
	}

	public async findByEmail(email: string): Promise<User | null | undefined> {
		return this.users.find(u => u.email === email) ?? null;
	}

	public async findById(id: string): Promise<User | null | undefined> {
		return this.users.find(u => u.id === id) ?? null;
	}

	public async getTimeSpent(_id: string, _categories?: string[]): Promise<number> {
		return this.timeSpent;
	}

	public async track(data: TrackMediaUserDTO): Promise<void> {
		this.tracked.push(data);
	}

	public async trackPlaythrough(data: TrackVideoGamePlaythroughDTO): Promise<void> {
		this.trackedRuns.push(data);
	}
}
