/**
 * @description 获取角度
 */
export default function getAngle(lng_a, lat_a, lng_b, lat_b) {
    var a = (90 - lat_b) * Math.PI / 180;
    var b = (90 - lat_a) * Math.PI / 180;
    var AOC_BOC = (lng_b - lng_a) * Math.PI / 180;
    var cosc = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(AOC_BOC);
    var sinc = Math.sqrt(1 - cosc * cosc);
    var sinA = Math.sin(a) * Math.sin(AOC_BOC) / sinc;
    var A = Math.asin(sinA) * 180 / Math.PI;
    var res = 0;
    if (lng_b > lng_a && lat_b > lat_a) res = A;
    else if (lng_b > lng_a && lat_b < lat_a) res = 180 - A;
    else if (lng_b < lng_a && lat_b < lat_a) res = 180 - A;
    else if (lng_b < lng_a && lat_b > lat_a) res = 360 + A;
    else if (lng_b > lng_a && lat_b == lat_a) res = 90;
    else if (lng_b < lng_a && lat_b == lat_a) res = 270;
    else if (lng_b == lng_a && lat_b > lat_a) res = 0;
    else if (lng_b == lng_a && lat_b < lat_a) res = 180;
    return res;
  }