import { type CreateUserDTO, HttpException, type User, type UsersRepository } from "@enki/domain";
import type { HashProvider } from "@hyoretsu/providers";
import { StatusCodes } from "http-status-codes";

export class CreateUser {
	constructor(
		private readonly hashProvider: HashProvider,
		private readonly usersRepository: UsersRepository,
	) {}

	public async execute({ email, password }: CreateUserDTO): Promise<User> {
		const existingUser = await this.usersRepository.findByEmail(email);
		if (existingUser) {
			throw new HttpException("An user with this email already exists.", StatusCodes.CONFLICT);
		}

		const hashedPassword = await this.hashProvider.generateHash(password);

		const { password: _, ...user } = await this.usersRepository.create({
			email,
			password: hashedPassword,
		});

		return user;
	}
}
