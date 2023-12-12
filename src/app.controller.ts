import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, Redirect, Render } from '@nestjs/common';
import { AppService } from './app.service';
import * as mysql from 'mysql2';
import { UjSutiDto } from './UjSutiDto';

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: '14s_ismetles',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  async index() {
    const [adatok, mezok] = await conn.execute('SELECT id, nev, ar, leiras FROM sutemenyek');

    console.log(adatok);

    return {
      sutemenyek: adatok,
    };
  }

  @Get('/sutemenyek/:id')
  @Render('suti')
  async egySuti(@Param('id') id: number) {
    const [adatok] = await conn.execute(
      'SELECT id, nev, ar, leiras FROM sutemenyek WHERE id = ?',
      [id],
    );
    return adatok[0];
  }

  @Get('/ujSuti')
  @Render('ujsuti')
  ujSutiForm() {
    //...
  }

  @Post('/ujSutik')
  @Redirect('/')
  async ujSuti(@Body() ujSuti: UjSutiDto) {
    console.log('Received Data:', ujSuti);
    const nev = ujSuti.nev || null;
    const ar = ujSuti.ar || null;
    const leiras = ujSuti.leiras || null;

    const [adatok] = await conn.execute(
      'INSERT INTO sutemenyek (nev, ar, leiras) VALUES (?, ?, ?)',
      [nev, ar.toString(), leiras],
    );
    return { ujSuti };
  }

  @Delete('/sutemenyek/:id')
  @Redirect('/')
  async deleteSuti(@Param('id') id: number) {
    const [adatok] = await conn.execute(
      'DELETE FROM sutemenyek WHERE id = ?', [id]);
  }

  @Get('/modosit/:id')
  @Render('modosit')
  async modositandoSuti(@Param('id') id: number) {
    const [adatok] = await conn.execute(
      'SELECT id, nev, ar, leiras FROM sutemenyek WHERE id = ?',
      [id],
    );
    const modositando: UjSutiDto = adatok[0];
    console.log(modositando);
    return {modositando};
  }

  @Put('/sutemenyek/:id')
  @Redirect('/')
  async editSutiForm(@Body() modosultSuti: UjSutiDto, @Param('id') id: number) {
    const nev = modosultSuti.nev;
    const ar = modosultSuti.ar;
    const leiras = modosultSuti.leiras;
    
    const [adatok] = await conn.execute('UPDATE sutemenyek SET nev = ?, ar = ?, leiras = ? WHERE id = ?', [nev, ar, leiras, id]);

    return {modosultSuti};
  }

}
