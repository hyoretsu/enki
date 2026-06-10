export class CreateVideoChannelDTO {
	externalId?: string;
	link?: string;
	name: string;
}

export type UpdateVideoChannelDTO = Partial<CreateVideoChannelDTO>;
