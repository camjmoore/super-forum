import { User } from "../src/repository/entities/User.ts";
import datasource from "../src/data-source.ts";

const confirmUser = async () => {
    await datasource.initialize();
    await datasource
    .createQueryBuilder()
    .update(User)
    .set({ confirmed: "true" })
    .where("id = :id", { id: 1 })
    .execute()
}

confirmUser();
