import { useState, useMemo } from "react";

const LOGO = "data:image/png;base64,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";

const PRODUCTS = [
  {c:"0136401",n:"Mármol Crema 40cm x LL Arenado 1,2cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:1286.19,res:0,pre_res:903,disp_cuc:0,disp_baq:1286.19,d1:983.9,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0163701",n:"Mármol Crema 40xLL Arenado con vetas",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:233.36,res:0,pre_res:0,disp_cuc:0,disp_baq:233.36,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0136402",n:"Mármol Crema 40cm x LL Cepillado 1,2cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:1.3,res:0,pre_res:0,disp_cuc:0,disp_baq:1.3,d1:0,d2:701.18,eta1:null,eta2:"Finales Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0137202",n:"Rompeola Mármol Crema 30.5x100cm Arenado 2cm",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:245.97,res:0,pre_res:246,disp_cuc:0,disp_baq:245.97,d1:251.97,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0166101",n:"Mármol Crema 30.5x100x2cm Arenado a la veta - Rompeolas",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:99,res:0,pre_res:0,disp_cuc:0,disp_baq:99,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0154501",n:"Mármol Arenado 40xLL 1,2cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:1300.58,res:0,pre_res:0,disp_cuc:0,disp_baq:1300.58,d1:1354.12,d2:0,eta1:"17 Feb",eta2:"26 Feb",est1:"EN ADUANA",est2:"EN ADUANA"},
  {c:"0156102",n:"Mármol Arenado 30.5xLL 2cm Rompeolas",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:503.98,res:0,pre_res:0,disp_cuc:0,disp_baq:503.98,d1:134.98,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0158501",n:"Mármol Nuevo Marfil 40xLL 1,2cm Cepillado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:12.34,res:0,pre_res:0,disp_cuc:0,disp_baq:12.34,d1:195,d2:695.2,eta1:"26 Feb",eta2:"Finales Mar",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0158504",n:"Mármol Nuevo Marfil 40xLL 1,5cm Brillado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:2019.72,res:0,pre_res:0,disp_cuc:0,disp_baq:2019.72,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0154102",n:"Mármol Café 40xLL 1,2cm Arenado",u:"m²",cat:"Mármol",stock_cuc:2.1,stock_baq:1338.24,res:0,pre_res:0,disp_cuc:2.1,disp_baq:1338.24,d1:863.64,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0154203",n:"Mármol Café 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:854.87,res:0,pre_res:0,disp_cuc:0,disp_baq:854.87,d1:183.97,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0156001",n:"Mármol Gris 40xLL 1,2cm Arenado",u:"m²",cat:"Mármol",stock_cuc:1.89,stock_baq:483.96,res:0,pre_res:0,disp_cuc:1.89,disp_baq:483.96,d1:140.32,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0156002",n:"Mármol Gris 60xLL 1,5cm Cepillado",u:"m²",cat:"Mármol",stock_cuc:2.56,stock_baq:234.28,res:0,pre_res:0,disp_cuc:2.56,disp_baq:234.28,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0154303",n:"Mármol Gris 30.5x100x2cm Rompeolas",u:"ml",cat:"Mármol",stock_cuc:0,stock_baq:219.62,res:0,pre_res:0,disp_cuc:0,disp_baq:219.62,d1:209.97,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0161901",n:"Mármol Tundra Grey 40xLL 1,2cm Pulido Mate",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:296.46,res:0,pre_res:0,disp_cuc:0,disp_baq:296.46,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0161902",n:"Mármol Tundra Light 32xLL 2cm Largos",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:200,eta1:null,eta2:"Mar 2026",est1:null,est2:"EN TRÁNSITO"},
  {c:"0159602",n:"Mármol Ibiza Gray 61x122x1cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:327.44,res:0,pre_res:0,disp_cuc:0,disp_baq:327.44,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0161802",n:"Mármol Ibiza Gold 61x122x1cm Brillante",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:327.44,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0161801",n:"Mármol Ibiza Gold Mix Polished 61x122x1cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:327.44,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0162001",n:"Mármol Afyon Grey 40xLL 1,2cm Pulido Mate",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:277.37,res:0,pre_res:0,disp_cuc:0,disp_baq:277.37,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0162003",n:"Mármol Afyon Grey 40xLL 1cm Arenado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:299.67,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0162004",n:"Mármol Afyon Grey 30xLL 2cm Arenado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:47.76,eta1:null,eta2:"18 Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0161601",n:"Mármol Gold Brillado 40xLL 1,2cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:300,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0163801",n:"Mármol Marrón Emperador 40xLL 2cm Brillado",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:7.36,res:0,pre_res:0,disp_cuc:0,disp_baq:7.36,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0158601",n:"Thin Brick Mármol Marfil 7x25x1,5cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:10.91,res:0,pre_res:0,disp_cuc:0,disp_baq:10.91,d1:0,d2:62.91,eta1:null,eta2:"Finales Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0158701",n:"Thin Brick Mármol Café 7x25x1,5cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:48.04,res:0,pre_res:0,disp_cuc:0,disp_baq:48.04,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0158801",n:"Thin Brick Mármol Gris 7x25x1,5cm",u:"m²",cat:"Mármol",stock_cuc:0,stock_baq:37.32,res:0,pre_res:0,disp_cuc:0,disp_baq:37.32,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // TRAVERTINO
  {c:"0128702",n:"Travertino Clásico 30.5x61x1,2cm Pulido",u:"m²",cat:"Travertino",stock_cuc:0.07,stock_baq:0,res:0,pre_res:0,disp_cuc:0.07,disp_baq:0,d1:0,d2:148.32,eta1:null,eta2:"18 Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0128701",n:"Travertino Clásico 40xLL 1,2cm Pulido Poro Abierto",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:1589.71,eta1:null,eta2:"18 Mar",est1:null,est2:"EN TRÁNSITO"},
  {c:"0163401",n:"Travertino Clásico 30xLL 2cm Pulido ml",u:"ml",cat:"Travertino",stock_cuc:0,stock_baq:171.67,res:0,pre_res:0,disp_cuc:0,disp_baq:171.67,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0163601",n:"Travertino Turco 30xLL 2cm Pulido",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:900,eta1:null,eta2:"Mar 2026",est1:null,est2:"EN TRÁNSITO"},
  {c:"0157201",n:"Travertino Macadamia 40.6x61x1,2cm Tomboleado",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:1333.39,res:5,pre_res:142,disp_cuc:0,disp_baq:1328.39,d1:0,d2:871.86,eta1:"17 Feb",eta2:"Primera sem Abr",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0157202",n:"Travertino Macadamia 40.6x61x1,2cm (Ref2)",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:0,res:80,pre_res:0,disp_cuc:0,disp_baq:0,d1:73.5,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0163101",n:"Travertino Macadamia 30.5x61x2cm Borde Piscina",u:"ml",cat:"Travertino",stock_cuc:0,stock_baq:181.73,res:0,pre_res:0,disp_cuc:0,disp_baq:181.73,d1:182.95,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0128102",n:"Travertino Ivory Crema 40.6x61x1,2cm Tomboleado",u:"m²",cat:"Travertino",stock_cuc:0.84,stock_baq:323.29,res:0,pre_res:280,disp_cuc:0.84,disp_baq:323.29,d1:274.82,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0128103",n:"Travertino Ivory Crema 40.6x61x1,2cm Pulido Retape",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:14.15,res:0,pre_res:70,disp_cuc:0,disp_baq:14.15,d1:682.97,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0163201",n:"Travertino Ivory 30.5x61x2cm ml",u:"ml",cat:"Travertino",stock_cuc:1.8,stock_baq:138.35,res:0,pre_res:0,disp_cuc:1.8,disp_baq:138.35,d1:183,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0154001",n:"Travertino Arena 40.6x61x1,2cm",u:"m²",cat:"Travertino",stock_cuc:0,stock_baq:783.08,res:0,pre_res:0,disp_cuc:0,disp_baq:783.08,d1:752.97,d2:911.49,eta1:"17 Feb",eta2:"Primera sem Abr",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0163301",n:"Travertino Arena 30.5x61x2cm ml",u:"ml",cat:"Travertino",stock_cuc:6.6,stock_baq:304.92,res:0,pre_res:0,disp_cuc:6.6,disp_baq:304.92,d1:304.92,d2:0,eta1:"17 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0128403",n:"Travertino Imperial 30xLL 3cm",u:"m²",cat:"Travertino",stock_cuc:30,stock_baq:0,res:0,pre_res:0,disp_cuc:30,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0128601",n:"Adoquín Travertino Noche 10x20x3cm",u:"m²",cat:"Travertino",stock_cuc:100,stock_baq:0,res:0,pre_res:0,disp_cuc:100,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // BALI/PIEDRA
  {c:"0000602",n:"Piedra Bali Verde 10x10cm Natural 1cm",u:"m²",cat:"Bali/Piedra",stock_cuc:0,stock_baq:9.79,res:0,pre_res:295,disp_cuc:0,disp_baq:9.79,d1:5,d2:200,eta1:"Feb 2026",eta2:"Mayo 2026",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0000601",n:"Piedra Bali Verde 20x20cm Natural 1cm",u:"m²",cat:"Bali/Piedra",stock_cuc:0,stock_baq:896,res:0,pre_res:5,disp_cuc:0,disp_baq:896,d1:695,d2:1050,eta1:"Feb 2026",eta2:"Mayo 2026",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0003201",n:"Bali Negra 10x10",u:"m²",cat:"Bali/Piedra",stock_cuc:16,stock_baq:160,res:0,pre_res:0,disp_cuc:16,disp_baq:160,d1:100,d2:0,eta1:"Feb 2026",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0003202",n:"Piedra Bali Negra 20x20cm Natural 1cm",u:"m²",cat:"Bali/Piedra",stock_cuc:0,stock_baq:62,res:0,pre_res:125,disp_cuc:0,disp_baq:62,d1:25,d2:0,eta1:"Feb 2026",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0160101",n:"Bali Azul 20x20",u:"m²",cat:"Bali/Piedra",stock_cuc:0,stock_baq:199,res:0,pre_res:0,disp_cuc:0,disp_baq:199,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // GRANITO
  {c:"0166501",n:"Adoquín Granito New Halayeb 10x20x3cm Tumbleado",u:"Und",cat:"Granito",stock_cuc:0,stock_baq:3.65,res:0,pre_res:0,disp_cuc:0,disp_baq:3.65,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0166503",n:"Adoquín Granito Gandola 10x20x3cm Tumbleado",u:"Und",cat:"Granito",stock_cuc:0,stock_baq:5,res:0,pre_res:0,disp_cuc:0,disp_baq:5,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // PIEDRA NATURAL
  {c:"0142812",n:"Crema Perlada 30.5x61x1,5cm Retapado Pulido",u:"m²",cat:"Piedra Natural",stock_cuc:59.9,stock_baq:0,res:0,pre_res:0,disp_cuc:59.9,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0148001",n:"Piedra Crema Perlada Patrón Francés",u:"m²",cat:"Piedra Natural",stock_cuc:0,stock_baq:115,res:0,pre_res:0,disp_cuc:0,disp_baq:115,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0136701",n:"Piedra Negro Absoluto 30xLL 1cm Natural",u:"m²",cat:"Piedra Natural",stock_cuc:13.29,stock_baq:0,res:0,pre_res:0,disp_cuc:13.29,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004904",n:"Piedra Muñeca Crema 30xLL 2cm",u:"m²",cat:"Piedra Natural",stock_cuc:6.86,stock_baq:0,res:0,pre_res:0,disp_cuc:6.86,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004704",n:"Piedra Muñeca Crema 30.5xLL 1cm",u:"m²",cat:"Piedra Natural",stock_cuc:0,stock_baq:37,res:0,pre_res:0,disp_cuc:0,disp_baq:37,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // SPLITFACE Y MÁS
  {c:"0158901",n:"Splitface Blanco 7x30x1,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:3.03,res:0,pre_res:0,disp_cuc:0,disp_baq:3.03,d1:81.48,d2:100,eta1:"26 Feb",eta2:"Finales Abr",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0158902",n:"Splitface Marfil 15x30x2,2cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:0,res:0,pre_res:163.43,disp_cuc:0,disp_baq:0,d1:261.91,d2:100.08,eta1:"26 Feb",eta2:"Finales Mar",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0159001",n:"Splitface Café 7x30x1,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:2.2,res:0,pre_res:0,disp_cuc:0,disp_baq:2.2,d1:113.4,d2:100,eta1:"26 Feb",eta2:"Finales Abr",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0159002",n:"Splitface Café 15x30x2cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:231.16,res:150,pre_res:0,disp_cuc:0,disp_baq:81.16,d1:175.14,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0160001",n:"Splitface Gris 7x30x1,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:61.12,res:0,pre_res:12,disp_cuc:0,disp_baq:61.12,d1:88.8,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0160002",n:"Splitface Gris 15x30x2,2cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:92.48,res:0,pre_res:0,disp_cuc:0,disp_baq:92.48,d1:100.17,d2:0,eta1:"26 Feb",eta2:null,est1:"EN ADUANA",est2:null},
  {c:"0162501",n:"Splitface Crema 30x7x1,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:63.24,res:0,pre_res:0,disp_cuc:0,disp_baq:63.24,d1:201.6,d2:71.4,eta1:"26 Feb",eta2:"Finales Mar",est1:"EN ADUANA",est2:"EN TRÁNSITO"},
  {c:"0130201",n:"Travertino Splitface 10xJP 2,5cm",u:"m²",cat:"Splitface y Más",stock_cuc:159.5,stock_baq:0,res:0,pre_res:0,disp_cuc:159.5,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0162302",n:"Rockface Piedra Rústica Blanco Irregular",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:388,res:0,pre_res:0,disp_cuc:0,disp_baq:388,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0162301",n:"Rockface Piedra Rústica Crema Irregular",u:"m²",cat:"Splitface y Más",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:435,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0007003",n:"Espacato Crema 7x25cm",u:"m²",cat:"Splitface y Más",stock_cuc:47.7,stock_baq:0,res:0,pre_res:0,disp_cuc:47.7,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0007004",n:"Espacato Crema 10x25cm",u:"m²",cat:"Splitface y Más",stock_cuc:56,stock_baq:0,res:0,pre_res:0,disp_cuc:56,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0007001",n:"Espacato Blanco 7x25cm",u:"m²",cat:"Splitface y Más",stock_cuc:8.62,stock_baq:0,res:0,pre_res:0,disp_cuc:8.62,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0007002",n:"Espacato Blanco 10x25cm",u:"m²",cat:"Splitface y Más",stock_cuc:4.5,stock_baq:0,res:0,pre_res:0,disp_cuc:4.5,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0153701",n:"Thin Brick Hudson White 7x19cm",u:"m²",cat:"Splitface y Más",stock_cuc:16,stock_baq:0,res:0,pre_res:0,disp_cuc:16,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // PIZARRA
  {c:"0000401",n:"Pizarra Negra Óxido 5x15",u:"m²",cat:"Pizarra",stock_cuc:124.7,stock_baq:0,res:0,pre_res:0,disp_cuc:124.7,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000402",n:"Pizarra Negra Óxido 10x20",u:"m²",cat:"Pizarra",stock_cuc:117.6,stock_baq:0,res:0,pre_res:0,disp_cuc:117.6,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000403",n:"Pizarra Negra Óxido 20x20",u:"m²",cat:"Pizarra",stock_cuc:62.15,stock_baq:0,res:0,pre_res:0,disp_cuc:62.15,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000501",n:"Pizarra Verde Bosque 5x15",u:"m²",cat:"Pizarra",stock_cuc:89.9,stock_baq:0,res:0,pre_res:0,disp_cuc:89.9,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000502",n:"Pizarra Verde Bosque 10x20",u:"m²",cat:"Pizarra",stock_cuc:101.72,stock_baq:0,res:0,pre_res:0,disp_cuc:101.72,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001901",n:"Pizarra Verde Lima 5x15",u:"m²",cat:"Pizarra",stock_cuc:108,stock_baq:0,res:0,pre_res:0,disp_cuc:108,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001902",n:"Pizarra Verde Lima 10x20",u:"m²",cat:"Pizarra",stock_cuc:50,stock_baq:0,res:0,pre_res:0,disp_cuc:50,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0002102",n:"Pizarra Roseta Gris 5x15",u:"m²",cat:"Pizarra",stock_cuc:137.45,stock_baq:0,res:0,pre_res:0,disp_cuc:137.45,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0002104",n:"Pizarra Roseta Gris 10x20",u:"m²",cat:"Pizarra",stock_cuc:135.56,stock_baq:0,res:0,pre_res:0,disp_cuc:135.56,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000901",n:"Pizarra Primavera 5x15",u:"m²",cat:"Pizarra",stock_cuc:124.25,stock_baq:0,res:0,pre_res:0,disp_cuc:124.25,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000902",n:"Pizarra Primavera 10x15",u:"m²",cat:"Pizarra",stock_cuc:77,stock_baq:0,res:0,pre_res:0,disp_cuc:77,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001801",n:"Pizarra Blanco Nieve 5x15",u:"m²",cat:"Pizarra",stock_cuc:70,stock_baq:0,res:0,pre_res:0,disp_cuc:70,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000801",n:"Pizarra Oro Narciso 5x15",u:"m²",cat:"Pizarra",stock_cuc:96.2,stock_baq:0,res:0,pre_res:0,disp_cuc:96.2,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0000802",n:"Pizarra Oro Narciso 10x20",u:"m²",cat:"Pizarra",stock_cuc:79.99,stock_baq:0,res:0,pre_res:0,disp_cuc:79.99,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004601",n:"Pizarra Negra Veta 3xJP",u:"m²",cat:"Pizarra",stock_cuc:154.5,stock_baq:0,res:0,pre_res:0,disp_cuc:154.5,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004602",n:"Pizarra Negra Veta 5xJP",u:"m²",cat:"Pizarra",stock_cuc:169,stock_baq:0,res:0,pre_res:0,disp_cuc:169,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0004603",n:"Pizarra Negra Veta 10xJP",u:"m²",cat:"Pizarra",stock_cuc:132,stock_baq:0,res:0,pre_res:0,disp_cuc:132,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  // ACCESORIOS
  {c:"0158101",n:"Rejilla Mármol Crema 20x80x3cm 6 ranuras",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:100,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0158201",n:"Rejilla Mármol Blanco 20x80x3cm Arenado",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:0,res:0,pre_res:22,disp_cuc:0,disp_baq:0,d1:0,d2:78,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0158301",n:"Rejilla Mármol Café 20x80x3cm 6 ranuras",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:80,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0163501",n:"Rejilla Mármol Gris 20x80x3cm 6 ranuras",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:30,res:0,pre_res:0,disp_cuc:0,disp_baq:30,d1:0,d2:50,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  {c:"0009401",n:"Lavamanos en Piedra Arenisca",u:"Und",cat:"Accesorios",stock_cuc:7,stock_baq:0,res:0,pre_res:0,disp_cuc:7,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0157501",n:"Lavamanos en Piedra Pizarra Negra",u:"Und",cat:"Accesorios",stock_cuc:10,stock_baq:0,res:0,pre_res:0,disp_cuc:10,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0166201",n:"Lavamanos en Mármol",u:"Und",cat:"Accesorios",stock_cuc:0,stock_baq:0,res:0,pre_res:0,disp_cuc:0,disp_baq:0,d1:0,d2:12,eta1:null,eta2:"Finales Abr",est1:null,est2:"EN TRÁNSITO"},
  // COMPLEMENTARIOS
  {c:"0150001",n:"Aquaprotector Hidrofugo PE 1 Litro",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:11,res:0,pre_res:0,disp_cuc:0,disp_baq:11,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0150002",n:"Aquaprotector Hidrofugo PE 4 Litros",u:"Und",cat:"Complementarios",stock_cuc:2,stock_baq:5,res:0,pre_res:0,disp_cuc:2,disp_baq:5,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0150003",n:"Aquaprotector Hidrofugo PE 20 Litros",u:"Und",cat:"Complementarios",stock_cuc:4,stock_baq:18,res:0,pre_res:0,disp_cuc:4,disp_baq:18,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0149916",n:"Boquilla Junta Flex Látex 5Kg Mocca",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:19,res:0,pre_res:0,disp_cuc:0,disp_baq:19,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0149915",n:"Boquilla Junta Flex Látex 5Kg Verde",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:20,res:0,pre_res:0,disp_cuc:0,disp_baq:20,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0149904",n:"Boquilla Junta Flex Látex 2Kg Beige",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:1,res:0,pre_res:0,disp_cuc:0,disp_baq:1,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001702",n:"EcoHidrofugo Sealine 1 Galón",u:"Und",cat:"Complementarios",stock_cuc:10,stock_baq:0,res:0,pre_res:0,disp_cuc:10,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001701",n:"EcoHidrofugo Sealine 1/4 Galón",u:"Und",cat:"Complementarios",stock_cuc:9,stock_baq:0,res:0,pre_res:0,disp_cuc:9,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001102",n:"Hidrofugo Sealine 1 Galón",u:"Und",cat:"Complementarios",stock_cuc:13,stock_baq:13,res:0,pre_res:0,disp_cuc:13,disp_baq:13,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001101",n:"Hidrofugo Sealine 1/4 Galón",u:"Und",cat:"Complementarios",stock_cuc:8,stock_baq:16,res:0,pre_res:0,disp_cuc:8,disp_baq:16,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001103",n:"Hidrofugo Sealine sin Color 5 Galones",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:19,res:0,pre_res:0,disp_cuc:0,disp_baq:19,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001202",n:"Rinse Sealine 1 Galón",u:"Und",cat:"Complementarios",stock_cuc:3,stock_baq:0,res:0,pre_res:0,disp_cuc:3,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0001201",n:"Rinse Sealine 1/4 Galón",u:"Und",cat:"Complementarios",stock_cuc:3,stock_baq:0,res:0,pre_res:0,disp_cuc:3,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0019303",n:"Sellador Exteriores Sealine 5 Galones",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:7,res:0,pre_res:0,disp_cuc:0,disp_baq:7,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0019302",n:"Sellador Exteriores Sealine 1 Galón",u:"Und",cat:"Complementarios",stock_cuc:5,stock_baq:7,res:0,pre_res:0,disp_cuc:5,disp_baq:7,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0019301",n:"Sellador Exteriores 1/4 Galón",u:"Und",cat:"Complementarios",stock_cuc:9,stock_baq:0,res:0,pre_res:0,disp_cuc:9,disp_baq:0,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0159107",n:"Boquilla MorcemColor Gris 5Kg",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:1,res:0,pre_res:0,disp_cuc:0,disp_baq:1,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0159105",n:"Boquilla MorcemColor Beige 5Kg",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:33,res:0,pre_res:0,disp_cuc:0,disp_baq:33,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
  {c:"0159106",n:"Boquilla MorcemColor Blanco 5Kg",u:"Und",cat:"Complementarios",stock_cuc:0,stock_baq:21,res:0,pre_res:0,disp_cuc:0,disp_baq:21,d1:0,d2:0,eta1:null,eta2:null,est1:null,est2:null},
];

const CATS = ["Todos","Mármol","Travertino","Bali/Piedra","Granito","Piedra Natural","Splitface y Más","Pizarra","Accesorios","Complementarios"];

const CS = {
  "Mármol":          {bg:"#e8f0fe",accent:"#1a56db",label:"#1e3a8a"},
  "Travertino":      {bg:"#ecfdf5",accent:"#059669",label:"#065f46"},
  "Bali/Piedra":     {bg:"#fefce8",accent:"#d97706",label:"#78350f"},
  "Granito":         {bg:"#f5f3ff",accent:"#7c3aed",label:"#4c1d95"},
  "Piedra Natural":  {bg:"#fff7ed",accent:"#c2410c",label:"#7c2d12"},
  "Splitface y Más": {bg:"#fdf4ff",accent:"#9333ea",label:"#581c87"},
  "Pizarra":         {bg:"#f1f5f9",accent:"#475569",label:"#1e293b"},
  "Accesorios":      {bg:"#f0fdf4",accent:"#16a34a",label:"#14532d"},
  "Complementarios": {bg:"#fff7ed",accent:"#ea580c",label:"#7c2d12"},
};

const ESTADO_BADGE = {
  "EN ADUANA":    {bg:"#fef9c3",color:"#854d0e",icon:"🟠"},
  "EN TRÁNSITO":  {bg:"#dbeafe",color:"#1d4ed8",icon:"🔵"},
  "EN PRODUCCIÓN":{bg:"#f3e8ff",color:"#7e22ce",icon:"🟣"},
  "EN PUERTO":    {bg:"#dcfce7",color:"#166534",icon:"🟢"},
};

const DIST_USERS = {
  "dist1@empresa.com":     {pass:"dist2026",name:"Distribuidora Norte",region:"Cúcuta"},
  "ventas@marmoles.com":   {pass:"marmoles1",name:"Mármoles del Caribe",region:"Barranquilla"},
  "compras@constru.com":   {pass:"constru2026",name:"Construeléctrica S.A.S.",region:"Bogotá"},
};

const fmt = v => v > 0 ? v.toLocaleString("es-CO",{maximumFractionDigits:1}) : "—";
const fmtN = v => typeof v === "number" && v > 0 ? v.toLocaleString("es-CO",{maximumFractionDigits:1}) : null;

// ── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const u = DIST_USERS[email.toLowerCase()];
      if (u && u.pass === pass) {
        onLogin({type:"distribuidor", email: email.toLowerCase(), name: u.name, region: u.region});
      } else { setErr("Correo o contraseña incorrectos."); }
    }, 700);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0a0f1e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans', sans-serif",padding:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@500;700&display=swap');*{box-sizing:border-box}`}</style>
      <div style={{marginBottom:32,textAlign:"center"}}>
        <div style={{background:"#fff",borderRadius:16,padding:"12px 24px",display:"inline-block",marginBottom:12,boxShadow:"0 4px 24px rgba(0,0,0,0.4)"}}>
          <img src={LOGO} alt="MeUp" style={{height:48,display:"block"}} />
        </div>
        <div style={{fontSize:13,color:"#64748b",letterSpacing:"0.1em",textTransform:"uppercase"}}>Portal de Distribuidores</div>
      </div>
      <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:20,padding:"36px 40px",width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        <h2 style={{color:"#f1f5f9",fontSize:20,fontWeight:800,margin:"0 0 6px",letterSpacing:"-0.02em"}}>Acceder al inventario</h2>
        <p style={{color:"#64748b",fontSize:13,margin:"0 0 28px"}}>Ingresa con tus credenciales de distribuidor</p>
        <div style={{marginBottom:18}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>Correo electrónico</label>
          <input value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="tu@empresa.com"
            style={{width:"100%",padding:"11px 14px",background:"#1e293b",border:"1px solid #334155",borderRadius:10,color:"#f1f5f9",fontSize:14,fontFamily:"inherit",outline:"none"}} />
        </div>
        <div style={{marginBottom:err?14:24}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:"#94a3b8",marginBottom:6,letterSpacing:"0.04em",textTransform:"uppercase"}}>Contraseña</label>
          <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••"
            style={{width:"100%",padding:"11px 14px",background:"#1e293b",border:"1px solid #334155",borderRadius:10,color:"#f1f5f9",fontSize:14,fontFamily:"inherit",outline:"none"}} />
        </div>
        {err && <div style={{fontSize:12,color:"#f87171",marginBottom:16,padding:"8px 12px",background:"#450a0a",borderRadius:8}}>⚠️ {err}</div>}
        <button onClick={handleLogin} disabled={loading||!email||!pass} style={{
          width:"100%",padding:"13px",background: loading||!email||!pass ? "#1e293b" : "linear-gradient(135deg,#3b82f6,#8b5cf6)",
          color: loading||!email||!pass ? "#475569" : "#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor: loading||!email||!pass?"not-allowed":"pointer",fontFamily:"inherit",
        }}>{loading ? "Verificando..." : "Ingresar →"}</button>
        <div style={{marginTop:20,padding:"12px 14px",background:"#0f172a",borderRadius:10,border:"1px solid #1e293b"}}>
          <div style={{fontSize:11,color:"#64748b",marginBottom:6,fontWeight:600}}>💡 Credenciales de prueba:</div>
          <div style={{fontSize:11,color:"#475569",fontFamily:"'DM Mono',monospace",lineHeight:1.8}}>
            dist1@empresa.com / dist2026<br/>ventas@marmoles.com / marmoles1
          </div>
        </div>
      </div>
    </div>
  );
}

// ── STATUS BADGE ──────────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  if (!estado) return null;
  const s = ESTADO_BADGE[estado] || {bg:"#f1f5f9",color:"#475569",icon:"⚪"};
  return (
    <span style={{
      fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:20,
      background:s.bg,color:s.color,letterSpacing:"0.04em",
      textTransform:"uppercase",whiteSpace:"nowrap",display:"inline-block",
    }}>{s.icon} {estado}</span>
  );
}

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
function Card({ p, isVendedor }) {
  const [open, setOpen] = useState(false);
  const cs = CS[p.cat]||CS["Complementarios"];
  const hasNav = p.d1>0 || p.d2>0;
  const hasReservas = isVendedor && p.res>0;
  const hasPreRes = isVendedor && p.pre_res>0;
  const totalNav = p.d1 + p.d2;
  const dispTotal = p.disp_baq + p.disp_cuc;

  return (
    <div onClick={()=>setOpen(!open)} style={{
      background:"#fff",borderRadius:12,cursor:"pointer",
      border:"1px solid #e2e8f0",borderLeft:`4px solid ${cs.accent}`,
      boxShadow:open?"0 6px 24px rgba(0,0,0,0.08)":"0 1px 3px rgba(0,0,0,0.04)",
      transition:"box-shadow 0.15s",overflow:"hidden",
    }}>
      {/* ── COLLAPSED ROW ── */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",flexWrap:"wrap"}}>
        {/* Name + code */}
        <div style={{flex:1,minWidth:180}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2,flexWrap:"wrap"}}>
            <span style={{fontSize:10,fontWeight:700,color:cs.label,background:cs.bg,padding:"1px 7px",borderRadius:20,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{p.cat}</span>
            <span style={{fontSize:10,color:"#94a3b8",fontFamily:"'DM Mono',monospace"}}>{p.c}</span>
          </div>
          <div style={{fontSize:13,fontWeight:600,color:"#1e293b",lineHeight:1.25}}>{p.n}</div>
        </div>

        {/* Disp B/quilla */}
        <div style={{
          background: p.disp_baq>0 ? cs.bg : "#f8fafc",
          border:`1px solid ${p.disp_baq>0 ? cs.accent+"44" : "#e2e8f0"}`,
          borderRadius:9,padding:"5px 11px",textAlign:"center",minWidth:70,
        }}>
          <div style={{fontSize:15,fontWeight:800,color:p.disp_baq>0?cs.accent:"#cbd5e1",fontFamily:"'DM Mono',monospace"}}>{fmt(p.disp_baq)}</div>
          <div style={{fontSize:10,color:"#64748b",marginTop:1}}>🔵 B/quilla</div>
        </div>

        {/* Disp Cúcuta */}
        <div style={{textAlign:"center",minWidth:58}}>
          <div style={{fontSize:14,fontWeight:700,color:p.disp_cuc>0?"#64748b":"#cbd5e1",fontFamily:"'DM Mono',monospace"}}>{fmt(p.disp_cuc)}</div>
          <div style={{fontSize:10,color:"#94a3b8"}}>⚪ Cúcuta</div>
        </div>

        {/* Disp 1 pill */}
        {p.d1>0 && (
          <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:9,padding:"5px 11px",textAlign:"center",minWidth:68}}>
            <div style={{fontSize:13,fontWeight:700,color:"#92400e",fontFamily:"'DM Mono',monospace"}}>{fmt(p.d1)}</div>
            <div style={{fontSize:9,color:"#b45309",marginTop:1}}>🟠 Disp.1{p.eta1?` · ${p.eta1}`:""}</div>
          </div>
        )}

        {/* Disp 2 pill */}
        {p.d2>0 && (
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:9,padding:"5px 11px",textAlign:"center",minWidth:68}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1d4ed8",fontFamily:"'DM Mono',monospace"}}>{fmt(p.d2)}</div>
            <div style={{fontSize:9,color:"#3b82f6",marginTop:1}}>🔵 Disp.2{p.eta2?` · ${p.eta2}`:""}</div>
          </div>
        )}

        {/* Reservas — vendedor only */}
        {hasReservas && (
          <div style={{background:"#fff1f2",border:"1px solid #fecdd3",borderRadius:9,padding:"5px 11px",textAlign:"center",minWidth:62}}>
            <div style={{fontSize:13,fontWeight:700,color:"#be123c",fontFamily:"'DM Mono',monospace"}}>{fmt(p.res)}</div>
            <div style={{fontSize:9,color:"#e11d48",marginTop:1}}>🔒 Reservas</div>
          </div>
        )}

        {/* Pre-reserva — vendedor only */}
        {hasPreRes && (
          <div style={{background:"#fdf4ff",border:"1px solid #e9d5ff",borderRadius:9,padding:"5px 11px",textAlign:"center",minWidth:62}}>
            <div style={{fontSize:13,fontWeight:700,color:"#7e22ce",fontFamily:"'DM Mono',monospace"}}>{fmt(p.pre_res)}</div>
            <div style={{fontSize:9,color:"#9333ea",marginTop:1}}>🔮 Pre-res.</div>
          </div>
        )}

        <div style={{fontSize:11,color:"#cbd5e1",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",flexShrink:0}}>▾</div>
      </div>

      {/* ── EXPANDED DETAIL ── */}
      {open && (
        <div style={{margin:"0 14px 14px",padding:14,background:cs.bg,borderRadius:10,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
          
          {/* B/quilla */}
          <div style={{background:"#fff",borderRadius:9,padding:"12px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:10,fontWeight:700,color:cs.label,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>🔵 Disponible B/quilla</div>
            <div style={{fontSize:24,fontWeight:900,color:p.disp_baq>0?cs.accent:"#94a3b8",fontFamily:"'DM Mono',monospace"}}>{fmt(p.disp_baq)}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{p.u} disponibles</div>
            {p.stock_baq !== p.disp_baq && <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>Stock físico: {fmt(p.stock_baq)} {p.u}</div>}
          </div>

          {/* Cúcuta */}
          <div style={{background:"#fff",borderRadius:9,padding:"12px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>⚪ Disponible Cúcuta</div>
            <div style={{fontSize:24,fontWeight:900,color:p.disp_cuc>0?"#475569":"#94a3b8",fontFamily:"'DM Mono',monospace"}}>{fmt(p.disp_cuc)}</div>
            <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{p.u} disponibles</div>
            {p.stock_cuc !== p.disp_cuc && <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>Stock físico: {fmt(p.stock_cuc)} {p.u}</div>}
          </div>

          {/* Disp 1 */}
          {p.d1>0 && (
            <div style={{background:"#fff",borderRadius:9,padding:"12px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#92400e",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>🟠 Disp. 1 — Aduana / Puerto</div>
              <div style={{fontSize:24,fontWeight:900,color:"#92400e",fontFamily:"'DM Mono',monospace"}}>{fmt(p.d1)}</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{p.u}</div>
              {p.eta1 && <div style={{fontSize:10,color:"#b45309",marginTop:4}}>📅 ETA: {p.eta1}</div>}
              {p.est1 && <div style={{marginTop:5}}><EstadoBadge estado={p.est1} /></div>}
            </div>
          )}

          {/* Disp 2 */}
          {p.d2>0 && (
            <div style={{background:"#fff",borderRadius:9,padding:"12px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#1d4ed8",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>🔵 Disp. 2 — En Tránsito</div>
              <div style={{fontSize:24,fontWeight:900,color:"#1d4ed8",fontFamily:"'DM Mono',monospace"}}>{fmt(p.d2)}</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:2}}>{p.u}</div>
              {p.eta2 && <div style={{fontSize:10,color:"#2563eb",marginTop:4}}>📅 ETA: {p.eta2}</div>}
              {p.est2 && <div style={{marginTop:5}}><EstadoBadge estado={p.est2} /></div>}
            </div>
          )}

          {!hasNav && (
            <div style={{background:"#fff",borderRadius:9,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"center",opacity:0.6}}>
              <span style={{fontSize:12,color:"#94a3b8"}}>Sin material en tránsito</span>
            </div>
          )}

          {/* Reservas — vendedor only */}
          {hasReservas && (
            <div style={{background:"#fff",borderRadius:9,padding:"12px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#be123c",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>🔒 Reservas Activas</div>
              <div style={{fontSize:24,fontWeight:900,color:"#be123c",fontFamily:"'DM Mono',monospace"}}>{fmt(p.res)}</div>
              <div style={{fontSize:11,color:"#e11d48",marginTop:2}}>Material bloqueado para clientes</div>
            </div>
          )}

          {/* Pre-reserva — vendedor only */}
          {hasPreRes && (
            <div style={{background:"#fff",borderRadius:9,padding:"12px 14px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#7e22ce",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>🔮 Pre-Reserva en Tránsito</div>
              <div style={{fontSize:24,fontWeight:900,color:"#7e22ce",fontFamily:"'DM Mono',monospace"}}>{fmt(p.pre_res)}</div>
              <div style={{fontSize:11,color:"#9333ea",marginTop:2}}>Comprometido sobre contenedor</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("Todos");
  const [filterStock, setFilterStock] = useState(false);
  const [filterNav, setFilterNav] = useState(false);
  const [filterRes, setFilterRes] = useState(false);
  const isVendedor = user.type === "vendedor";

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    if (cat!=="Todos" && p.cat!==cat) return false;
    if (filterStock && (p.disp_baq+p.disp_cuc)<=0) return false;
    if (filterNav && (p.d1+p.d2)<=0) return false;
    if (filterRes && (p.res+p.pre_res)<=0) return false;
    if (search) {
      const q=search.toLowerCase();
      return p.n.toLowerCase().includes(q)||p.c.includes(q)||p.cat.toLowerCase().includes(q);
    }
    return true;
  }), [search,cat,filterStock,filterNav,filterRes]);

  const totBaq  = PRODUCTS.reduce((s,p)=>s+p.disp_baq,0);
  const totCuc  = PRODUCTS.reduce((s,p)=>s+p.disp_cuc,0);
  const totD1   = PRODUCTS.reduce((s,p)=>s+p.d1,0);
  const totD2   = PRODUCTS.reduce((s,p)=>s+p.d2,0);
  const totRes  = PRODUCTS.reduce((s,p)=>s+p.res,0);
  const totPre  = PRODUCTS.reduce((s,p)=>s+p.pre_res,0);
  const withD1  = PRODUCTS.filter(p=>p.d1>0).length;
  const withD2  = PRODUCTS.filter(p=>p.d2>0).length;

  const kpis = [
    {label:"Disp. Barranquilla",val:totBaq,sub:"m² / Und disponibles",icon:"🔵",c:"#0f172a"},
    {label:"Disp. Cúcuta",      val:totCuc,sub:"m² / Und disponibles",icon:"⚪",c:"#475569"},
    {label:"Disp. 1 — Aduana/Pto",val:totD1,sub:`${withD1} refs · próximo a llegar`,icon:"🟠",c:"#92400e"},
    {label:"Disp. 2 — Tránsito", val:totD2,sub:`${withD2} refs · navegando`,icon:"🔵",c:"#1d4ed8"},
    ...(isVendedor?[
      {label:"Reservas Activas",val:totRes,sub:"material bloqueado",icon:"🔒",c:"#be123c"},
      {label:"Pre-Reservas Tránsito",val:totPre,sub:"comprometido sobre contenedor",icon:"🔮",c:"#7e22ce"},
    ]:[]),
  ];

  return (
    <div style={{minHeight:"100vh",background:"#f8fafc",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@500;700&display=swap');*{box-sizing:border-box}input::placeholder{color:#94a3b8}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}`}</style>

      {/* Header */}
      <div style={{background:"#0f172a",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 0 rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",gap:16,padding:"0 20px",height:58}}>
          <div style={{background:"#fff",borderRadius:8,padding:"5px 10px",display:"flex",alignItems:"center"}}>
            <img src={LOGO} alt="MeUp" style={{height:28}} />
          </div>
          <div style={{height:28,width:1,background:"#1e293b"}} />
          <div style={{fontSize:12,color:"#64748b",letterSpacing:"0.04em",textTransform:"uppercase"}}>Inventario en Tiempo Real</div>
          <div style={{flex:1}} />
          {/* Estado leyenda */}
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {[["🟠","Aduana/Pto","#fef9c3","#92400e"],["🔵","En Tránsito","#dbeafe","#1d4ed8"]].map(([icon,label,bg,color])=>(
              <span key={label} style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:20,background:bg,color,border:`1px solid ${color}22`}}>{icon} {label}</span>
            ))}
          </div>
          <div style={{
            padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase",
            background: isVendedor ? "#1e3a5f" : "#1c1917",
            color: isVendedor ? "#93c5fd" : "#d6d3d1",
            border: `1px solid ${isVendedor ? "#2563eb44" : "#44403c"}`,
          }}>
            {isVendedor ? "👤 Vendedor" : `🏪 ${user.name}`}
          </div>
          {!isVendedor && (
            <button onClick={onLogout} style={{padding:"6px 14px",background:"transparent",border:"1px solid #1e293b",borderRadius:9,color:"#64748b",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Salir</button>
          )}
          <div style={{fontSize:11,color:"#334155"}}>28 Feb 2026</div>
        </div>
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:"22px 20px"}}>
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:`repeat(${kpis.length},1fr)`,gap:12,marginBottom:22}}>
          {kpis.map((k,i)=>(
            <div key={i} style={{background:"#fff",borderRadius:14,padding:"14px 18px",border:"1px solid #e2e8f0",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <span style={{fontSize:11,fontWeight:600,color:"#64748b",letterSpacing:"0.04em",textTransform:"uppercase",lineHeight:1.3}}>{k.label}</span>
                <span style={{fontSize:16}}>{k.icon}</span>
              </div>
              <div style={{fontSize:26,fontWeight:900,color:k.c,fontFamily:"'DM Mono',monospace",letterSpacing:"-0.02em"}}>{k.val.toLocaleString("es-CO",{maximumFractionDigits:0})}</div>
              <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{position:"relative",flex:1,minWidth:180}}>
            <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:13}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o código..."
              style={{width:"100%",padding:"9px 10px 9px 33px",border:"1px solid #e2e8f0",borderRadius:10,fontSize:13,fontFamily:"inherit",outline:"none",background:"#fff",color:"#1e293b"}} />
          </div>
          {CATS.map(c=>{
            const active=cat===c;
            const s=CS[c]||{bg:"#f8fafc",accent:"#64748b",label:"#64748b"};
            return (
              <button key={c} onClick={()=>setCat(c)} style={{
                padding:"6px 11px",borderRadius:9,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                border:`1px solid ${active?s.accent:"#e2e8f0"}`,background:active?s.bg:"#fff",color:active?s.label:"#64748b",
                transition:"all 0.15s",textTransform:"uppercase",letterSpacing:"0.03em",whiteSpace:"nowrap",
              }}>{c}</button>
            );
          })}
          {[
            {k:"filterStock",label:"📦 Con stock",st:filterStock,fn:()=>setFilterStock(!filterStock)},
            {k:"filterNav",  label:"🚢 En tránsito",st:filterNav,fn:()=>setFilterNav(!filterNav)},
            ...(isVendedor?[{k:"filterRes",label:"🔒 Reservas/Pre-res",st:filterRes,fn:()=>setFilterRes(!filterRes)}]:[]),
          ].map(f=>(
            <button key={f.k} onClick={f.fn} style={{
              padding:"6px 11px",borderRadius:9,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              border:`1px solid ${f.st?"#3b82f6":"#e2e8f0"}`,background:f.st?"#eff6ff":"#fff",color:f.st?"#1d4ed8":"#64748b",
              transition:"all 0.15s",whiteSpace:"nowrap",
            }}>{f.label}</button>
          ))}
          {(filterStock||filterNav||filterRes||cat!=="Todos"||search) && (
            <button onClick={()=>{setSearch("");setCat("Todos");setFilterStock(false);setFilterNav(false);setFilterRes(false);}} style={{
              padding:"6px 11px",borderRadius:9,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
              border:"1px solid #fee2e2",background:"#fef2f2",color:"#dc2626",
            }}>✕ Limpiar</button>
          )}
        </div>

        <div style={{fontSize:12,color:"#94a3b8",marginBottom:12}}>{filtered.length} referencias · <span style={{color:"#64748b"}}>Disp. 1 = Aduana/Puerto · Disp. 2 = Navegando</span></div>

        {/* Product list */}
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {filtered.map(p=><Card key={p.c+p.cat} p={p} isVendedor={isVendedor} />)}
          {filtered.length===0 && (
            <div style={{textAlign:"center",padding:"60px 20px",color:"#94a3b8"}}>
              <div style={{fontSize:32,marginBottom:10}}>🔍</div>
              <div style={{fontSize:15,fontWeight:600}}>Sin resultados</div>
            </div>
          )}
        </div>

        {/* Distributor footer */}
        {!isVendedor && (
          <div style={{marginTop:28,padding:"14px 18px",background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",fontSize:12,color:"#64748b",lineHeight:1.6}}>
            <strong style={{color:"#1e293b"}}>¿Quieres reservar material?</strong> Contacta a tu asesor MeUp con el código del producto y la cantidad.{" "}
            <span style={{color:"#92400e",fontWeight:600}}>🟠 Disp. 1</span> = primer contenedor llegando (Aduana/Puerto) ·{" "}
            <span style={{color:"#1d4ed8",fontWeight:600}}>🔵 Disp. 2</span> = siguiente contenedor navegando. Fechas ETA son estimadas.
          </div>
        )}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  if (!user && !showLogin) {
    return (
      <div style={{minHeight:"100vh",background:"#0a0f1e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:20}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@500;700&display=swap');*{box-sizing:border-box}`}</style>
        <div style={{background:"#fff",borderRadius:16,padding:"14px 28px",marginBottom:20,boxShadow:"0 4px 24px rgba(0,0,0,0.4)"}}>
          <img src={LOGO} alt="MeUp" style={{height:52,display:"block"}} />
        </div>
        <h1 style={{color:"#f1f5f9",fontSize:22,fontWeight:800,margin:"0 0 8px",letterSpacing:"-0.02em",textAlign:"center"}}>Portal de Inventario</h1>
        <p style={{color:"#64748b",fontSize:14,margin:"0 0 40px",textAlign:"center"}}>Selecciona cómo quieres acceder</p>
        <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center",maxWidth:520}}>
          <button onClick={()=>setUser({type:"vendedor",name:"Equipo MeUp"})} style={{
            flex:1,minWidth:220,padding:"22px 28px",background:"linear-gradient(135deg,#1e3a5f,#1d4ed8)",
            border:"1px solid #2563eb44",borderRadius:18,color:"#fff",cursor:"pointer",fontFamily:"inherit",textAlign:"left",boxShadow:"0 8px 32px rgba(29,78,216,0.3)",
          }}>
            <div style={{fontSize:28,marginBottom:8}}>👤</div>
            <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>Vendedor MeUp</div>
            <div style={{fontSize:12,color:"#93c5fd",lineHeight:1.4}}>Stock completo · Disp.1 · Disp.2 · Reservas · Pre-Reservas en tránsito</div>
          </button>
          <button onClick={()=>setShowLogin(true)} style={{
            flex:1,minWidth:220,padding:"22px 28px",background:"linear-gradient(135deg,#1c1917,#292524)",
            border:"1px solid #44403c",borderRadius:18,color:"#fff",cursor:"pointer",fontFamily:"inherit",textAlign:"left",
          }}>
            <div style={{fontSize:28,marginBottom:8}}>🏪</div>
            <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>Distribuidor</div>
            <div style={{fontSize:12,color:"#a8a29e",lineHeight:1.4}}>Acceso con credenciales · Stock disponible + Disp.1 y Disp.2</div>
          </button>
        </div>
      </div>
    );
  }

  if (showLogin && !user) return <LoginScreen onLogin={u=>{setUser(u);setShowLogin(false);}} />;
  return <Dashboard user={user} onLogout={()=>{setUser(null);setShowLogin(false);}} />;
}
