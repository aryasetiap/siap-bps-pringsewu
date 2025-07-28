import { IsInt, Min } from 'class-validator';

export class AddStokDto {
  @IsInt()
  @Min(1)
  jumlah: number;
}
