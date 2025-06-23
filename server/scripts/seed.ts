// Enables TypeORM to read its decorators at runtime
import "reflect-metadata";
import dataSource from "../src/data-source";
import { User } from "../src/repository/entities/User";
import { ThreadCategory } from "../src/repository/entities/ThreadCategory";
import { Thread } from "../src/repository/entities/Thread";
import { ThreadItem } from "../src/repository/entities/ThreadItem";
import { ThreadPoint } from "../src/repository/entities/ThreadPoint";
import { ThreadItemPoint } from "../src/repository/entities/ThreadItemPoint";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const robustSeed = async () => {
  try {
    console.log("Initializing data source...");
    await dataSource.initialize();
    console.log("✅ Data source initialized");
    
    // Start transaction
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Step 1: Create admin user
      console.log("Creating admin user...");
      const adminUser = new User();
      adminUser.email = "admin@forum.com";
      adminUser.userName = "admin";
      adminUser.password = await bcrypt.hash("AdminPass123!", 10);
      adminUser.confirmed = true;
      adminUser.isDisabled = false;
      adminUser.createdBy = "system";
      adminUser.createdOn = new Date();
      adminUser.lastModifiedBy = "system";
      adminUser.lastModifiedOn = new Date();
      
      const savedAdmin = await queryRunner.manager.save(adminUser);
      console.log("✅ Admin user created with ID:", savedAdmin.id);
      
      // Step 2: Create categories
      console.log("Creating categories...");
      const categoryData = [
        { name: "General Discussion", description: "General topics and discussions" },
        { name: "Technical Support", description: "Get help with technical issues" },
        { name: "Feature Requests", description: "Suggest new features" },
        { name: "Bug Reports", description: "Report bugs and issues" },
        { name: "Announcements", description: "Official announcements" }
      ];
      
      const categories: ThreadCategory[] = [];
      for (const catData of categoryData) {
        const category = new ThreadCategory();
        category.name = catData.name;
        category.description = catData.description;
        category.createdBy = "admin";
        category.createdOn = new Date();
        category.lastModifiedBy = "admin";
        category.lastModifiedOn = new Date();
        
        const savedCategory = await queryRunner.manager.save(category);
        categories.push(savedCategory);
      }
      console.log(`✅ Created ${categories.length} categories`);
      
      // Step 3: Create regular users
      console.log("Creating regular users...");
      const users: User[] = [];
      for (let i = 0; i < 15; i++) {
        const user = new User();
        user.email = faker.internet.email();
        user.userName = faker.internet.username();
        user.password = await bcrypt.hash("Password123!", 10);
        user.confirmed = true;
        user.isDisabled = false;
        user.createdBy = "system";
        user.createdOn = faker.date.past({ years: 1 });
        user.lastModifiedBy = "system";
        user.lastModifiedOn = new Date();
        
        const savedUser = await queryRunner.manager.save(user);
        users.push(savedUser);
      }
      console.log(`✅ Created ${users.length} regular users`);
      
      const allUsers = [savedAdmin, ...users];
      
      // Step 4: Create threads
      console.log("Creating threads...");
      const threads: Thread[] = [];
      for (let i = 0; i < 30; i++) {
        const thread = new Thread();
        thread.title = faker.lorem.sentence({ min: 3, max: 8 });
        thread.body = faker.lorem.paragraphs(faker.number.int({ min: 2, max: 5 }));
        thread.views = faker.number.int({ min: 0, max: 500 });
        thread.isDisabled = Math.random() < 0.05;
        thread.user = allUsers[Math.floor(Math.random() * allUsers.length)];
        thread.threadCategory = categories[Math.floor(Math.random() * categories.length)];
        thread.createdBy = "system";
        thread.createdOn = faker.date.past({ years: 1 });
        thread.lastModifiedBy = "system";
        thread.lastModifiedOn = new Date();
        
        const savedThread = await queryRunner.manager.save(thread);
        threads.push(savedThread);
      }
      console.log(`✅ Created ${threads.length} threads`);
      
      // Step 5: Create thread items (replies)
      console.log("Creating thread items...");
      let totalThreadItems = 0;
      for (const thread of threads) {
        const numReplies = Math.floor(Math.random() * 8);
        
        for (let j = 0; j < numReplies; j++) {
          const threadItem = new ThreadItem();
          threadItem.body = faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 }));
          threadItem.views = faker.number.int({ min: 0, max: 100 });
          threadItem.isDisabled = Math.random() < 0.05;
          threadItem.user = allUsers[Math.floor(Math.random() * allUsers.length)];
          threadItem.thread = thread;
          threadItem.createdBy = "system";
          threadItem.createdOn = faker.date.past({ years: 1 });
          threadItem.lastModifiedBy = "system";
          threadItem.lastModifiedOn = new Date();
          
          const savedThreadItem = await queryRunner.manager.save(threadItem);
          totalThreadItems++;
          
          // Add thread item points
          const numVotes = Math.floor(Math.random() * 5);
          for (let k = 0; k < numVotes; k++) {
            const point = new ThreadItemPoint();
            point.user = allUsers[Math.floor(Math.random() * allUsers.length)];
            point.threadItem = savedThreadItem;
            point.isDecrement = Math.random() < 0.3;
            point.createdBy = "system";
            point.createdOn = new Date();
            point.lastModifiedBy = "system";
            point.lastModifiedOn = new Date();
            
            await queryRunner.manager.save(point);
          }
        }
      }
      console.log(`✅ Created ${totalThreadItems} thread items`);
      
      // Step 6: Add thread points (voting)
      console.log("Creating thread points...");
      let totalThreadPoints = 0;
      for (const thread of threads) {
        const numVotes = Math.floor(Math.random() * 12);
        
        for (let i = 0; i < numVotes; i++) {
          const point = new ThreadPoint();
          point.user = allUsers[Math.floor(Math.random() * allUsers.length)];
          point.thread = thread;
          point.isDecrement = Math.random() < 0.25;
          point.createdBy = "system";
          point.createdOn = new Date();
          point.lastModifiedBy = "system";
          point.lastModifiedOn = new Date();
          
          await queryRunner.manager.save(point);
          totalThreadPoints++;
        }
      }
      console.log(`✅ Created ${totalThreadPoints} thread points`);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      console.log("database seeded successfully!");
      
      // Final verification
      console.log("Final verification...");
      const finalUserCount = await dataSource.manager.count(User);
      const finalCategoryCount = await dataSource.manager.count(ThreadCategory);
      const finalThreadCount = await dataSource.manager.count(Thread);
      const finalThreadItemCount = await dataSource.manager.count(ThreadItem);
      const finalThreadPointCount = await dataSource.manager.count(ThreadPoint);
      const finalThreadItemPointCount = await dataSource.manager.count(ThreadItemPoint);
      
      console.log("Final counts:");
      console.log(`  Users: ${finalUserCount}`);
      console.log(`  Categories: ${finalCategoryCount}`);
      console.log(`  Threads: ${finalThreadCount}`);
      console.log(`  Thread Items: ${finalThreadItemCount}`);
      console.log(`  Thread Points: ${finalThreadPointCount}`);
      console.log(`  Thread Item Points: ${finalThreadItemPointCount}`);
      
    } catch (error) {
      console.error("❌ Seeding failed, rolling back transaction:", error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Script failed:", error);
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    process.exit(1);
  }
};

robustSeed();

