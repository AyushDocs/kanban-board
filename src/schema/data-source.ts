import { Todo } from "@/schema/entity/Todo";
import { User } from "@/schema/entity/User";
import { DataSource, DataSourceOptions } from "typeorm";

const options: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "postgres",
    password: "Ayush@321",
    database: "postgres",
    synchronize: true,
    logging: true,
    entities: [Todo, User],
    subscribers: [],
    migrations: [],
};
const dataSource = new DataSource(options);

export default dataSource