import { test } from '../../fixtures/fixtures';
import { databaseName, queryDb } from '../../helper/database/sql-database-helper';
import { logger } from '../../helper/logger/logger';

test.describe('Database Connectivity Checks  @databaseTests@regression', () => {
  test('should query faculty and student databases and log results', async () => {
    await test.step('Query Faculty Database', async () => {
      const faculty = await queryDb(databaseName.shieldfaculty, `SELECT * FROM facultydetails`);

      logger.info(`First faculty firstname: ${faculty[0].firstname}`);
      logger.info(`First faculty surname: ${faculty[0].surname}`);

      // Optional: In TDD, we usually add an assertion to make it a real test
      test.expect(faculty.length).toBeGreaterThan(0);
    });

    await test.step('Query Student Database', async () => {
      const students = await queryDb(databaseName.shieldstudent, `SELECT * FROM studentdetails`);

      logger.info(`First student surname: ${students[0].surname}`);
      logger.info(`First student firstname: ${students[0].firstname}`);

      test.expect(students.length).toBeGreaterThan(0);
    });
  });
});
