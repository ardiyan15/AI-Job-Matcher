import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from '../../user/user.entity'

export default class UserSeeder implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const userRepo = dataSource.getRepository(User)

        const passwordHash = await bcrypt.hash('admin123', 10)

        const isExist = await userRepo.findOneBy({username: 'admin'})

        if(isExist) return;

        await userRepo.insert({
            username: 'admin',
            password: passwordHash,
            email: 'admin@gmail.com',
            role: 'admin'
        })
    }
}