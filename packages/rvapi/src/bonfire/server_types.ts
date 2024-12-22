import type {
	Channel,
	Embed,
	Emoji,
	Member,
	Message as DeltaMessage,
	Relationship,
	Role,
	Server,
	User,
} from '@jersey/revolt-api-types';

interface BError {
	type: 'Error';
	error:
		| 'LabelMe'
		| 'InternalError'
		| 'InvalidSession'
		| 'OnboardingNotFinished'
		| 'AlreadyAuthenticated';
}

interface Authenticated {
	type: 'Authenticated';
}

interface Bulk {
	type: 'Bulk';
	v: ServerMessage[];
}

interface Pong {
	type: 'Pong';
	data?: number;
}

interface Ready {
	type: 'Ready';
	users: User[];
	servers: Server[];
	channels: Channel[];
	emojis: Emoji[];
}

interface Message extends DeltaMessage {
	type: 'Message';
}

interface MessageUpdate {
	type: 'MessageUpdate';
	id: string;
	channel: string;
	data: Partial<DeltaMessage>;
}

interface MessageAppend {
	type: 'MessageAppend';
	id: string;
	channel: string;
	append: {
		embeds?: Embed[];
	};
}

interface MessageDelete {
	type: 'MessageDelete';
	id: string;
	channel: string;
}

interface MessageReact {
	type: 'MessageReact';
	id: string;
	channel_id: string;
	user_id: string;
	emoji_id: string;
}

interface MessageUnreact {
	type: 'MessageUnreact';
	id: string;
	channel_id: string;
	user_id: string;
	emoji_id: string;
}

interface MessageRemoveReaction {
	type: 'MessageRemoveReaction';
	id: string;
	channel_id: string;
	emoji_id: string;
}

type ChannelCreate = {
	type: 'ChannelCreate';
} & Channel;

interface ChannelUpdate {
	type: 'ChannelUpdate';
	id: string;
	data: Partial<Channel>;
	clear?: ('Icon' | 'Description')[];
}

interface ChannelDelete {
	type: 'ChannelDelete';
	id: string;
}

interface ChannelGroupJoin {
	type: 'ChannelGroupJoin';
	id: string;
	user: string;
}

interface ChannelGroupLeave {
	type: 'ChannelGroupLeave';
	id: string;
	user: string;
}

interface ChannelStartTyping {
	type: 'ChannelStartTyping';
	id: string;
	user: string;
}

interface ChannelStopTyping {
	type: 'ChannelStopTyping';
	id: string;
	user: string;
}

interface ChannelAck {
	type: 'ChannelAck';
	id: string;
	user: string;
	message_id: string;
}

interface ServerCreate extends Server {
	type: 'ServerCreate';
}

interface ServerUpdate {
	type: 'ServerUpdate';
	id: string;
	data: Partial<Server>;
	clear?: ('Icon' | 'Description' | 'Banner')[];
}

interface ServerDelete {
	type: 'ServerDelete';
	id: string;
}

interface ServerMemberUpdate {
	type: 'ServerMemberUpdate';
	server: string;
	user: string;
	data: Partial<Member>;
	clear?: ('Nickname' | 'Avatar')[];
}

interface ServerMemberJoin {
	type: 'ServerMemberJoin';
	id: string;
	user: string;
}

interface ServerMemberLeave {
	type: 'ServerMemberLeave';
	id: string;
	user: string;
}

interface ServerRoleUpdate {
	type: 'ServerRoleUpdate';
	server: string;
	role: string;
	data: Partial<Role>;
	clear?: ('Colour')[];
}

interface ServerRoleDelete {
	type: 'ServerRoleDelete';
	id: string;
	role_id: string;
}

interface UserUpdate {
	type: 'UserUpdate';
	id: string;
	data: Partial<User>;
	clear?: (
		| 'Avatar'
		| 'DisplayName'
		| 'StatusText'
		| 'ProfileContent'
		| 'ProfileBackground'
	)[];
}

interface UserRelationship {
	type: 'UserRelationship';
	user: User;
	id: string;
	status: Relationship;
}

interface UserPlatformWipe {
	type: 'UserPlatformWipe';
	user_id: string;
	flags: string;
}

interface EmojiCreate extends Emoji {
	type: 'EmojiCreate';
}

interface EmojiDelete {
	type: 'EmojiDelete';
	id: string;
}

interface AuthDeleteSession {
	type: 'Auth';
	event_type: 'DeleteSession';
	user_id: string;
	session_id: string;
}

interface AuthDeleteAllSessions {
	type: 'Auth';
	event_type: 'DeleteAllSessions';
	user_id: string;
	exclude_session_id: string;
}

/** packets that can be sent by the server */
export type ServerMessage =
	| AuthDeleteAllSessions
	| AuthDeleteSession
	| Authenticated
	| BError
	| Bulk
	| ChannelAck
	| ChannelCreate
	| ChannelDelete
	| ChannelGroupJoin
	| ChannelGroupLeave
	| ChannelStartTyping
	| ChannelStopTyping
	| ChannelUpdate
	| EmojiCreate
	| EmojiDelete
	| Message
	| MessageAppend
	| MessageDelete
	| MessageReact
	| MessageRemoveReaction
	| MessageUnreact
	| MessageUpdate
	| Pong
	| Ready
	| ServerCreate
	| ServerDelete
	| ServerMemberJoin
	| ServerMemberLeave
	| ServerMemberUpdate
	| ServerRoleDelete
	| ServerRoleUpdate
	| ServerUpdate
	| UserPlatformWipe
	| UserRelationship
	| UserUpdate;
