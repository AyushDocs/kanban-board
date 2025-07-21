/** @format */

import "reflect-metadata"
import dataSource from './data-source';
import { User } from "@/schema/entity/User";
import { Todo } from "@/schema/entity/Todo";
import { Repository } from "typeorm";

let dbInstance = dataSource

export const dbSource = async () => {
	if (!dataSource.isInitialized){
		dbInstance = await dataSource.initialize()
		seedData({
		userRepository: dataSource.getRepository(User),
		todoRepository: dataSource.getRepository(Todo)
	})
	}

	return {
		userRepository: dataSource.getRepository(User),
		todoRepository: dataSource.getRepository(Todo)
	};
};

export default dbInstance;

const seedData=async({userRepository,todoRepository}:{userRepository:Repository<User>;todoRepository:Repository<Todo>})=>{
		const userEmail = 'ayushalokdubey@gmail.com';
		let user = await userRepository.findOneBy({ email: userEmail });
		if (!user) {
			user = userRepository.create({
				email: userEmail,
				name: 'Ayush Alok Dubey',
				// image is optional, so only set if needed
			});
			await userRepository.save(user);
		}

		// Insert todos for next 5 days, 2 per day
		const now = new Date('7/21/25');
		for (let day = 0; day < 5; day++) {
			const dueDate = new Date(now);
			dueDate.setDate(now.getDate() + day);
			for (let t = 1; t <= 2; t++) {
				const todo = todoRepository.create({
					title: `Todo ${t} for ${dueDate.toDateString()}`,
					description: `This is todo ${t} for ${dueDate.toDateString()}`,
					userEmail: userEmail,
					user: user,
					dueDate: dueDate,
				});
				await todoRepository.save(todo);
			}
		}
		console.log('datasource initialized successfully')
}