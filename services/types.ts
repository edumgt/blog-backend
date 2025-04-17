export interface RegisterUserInput {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
}

export interface CreatePostInput {
  title: string;
  text: string;
  tags?: string[];
  imageUrl?: string;
}
