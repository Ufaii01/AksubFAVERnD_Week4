import { prisma } from "../prisma";

class AuthRepository {
    static findByEmail = async (email: string) => {
        return prisma.user.findUnique({
            where: { email },
        });
    }
    
    static register = async (data: any) => {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
            }
        });
    }

}

export default AuthRepository;