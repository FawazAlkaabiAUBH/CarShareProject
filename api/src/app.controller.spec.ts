import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API info', () => {
      const result = appController.getApiInfo();
      expect(result).toBeDefined();
      expect(result.name).toBe('AUBH CarShare API');
      expect(result.version).toBe('1.0.0');
      expect(result.endpoints).toBeDefined();
      expect(result.features).toBeInstanceOf(Array);
    });
  });
});
