import { Controller, All, NotFoundException } from '@nestjs/common';

@Controller('*') // Use '*' to match all routes
export class FallbackController {
  @All() // Handles all HTTP methods (GET, POST, etc.)
  handleNotFound() {
    throw new NotFoundException('Route request not found');
  }
}
