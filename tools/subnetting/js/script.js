// ALL CODE IN THIS BY MUHAMAD MULQI ( XANDER ID)
$(document).ready(function () {
  Swal.fire({
    title: "Informasi",
    html: "Sebelum Memulai, Mohon maaf jika ada data yang salah, karena Project Ini hanya dikerjakan untuk Membantu Pekerjaan Tugas saya disekolah saja :)<br/><br/>Oleh Muhamad Mulqi (XI TKJ-B)",
    icon: "info",
  });

  $("#results").hide();

  function ipToLong(ip) {
    const ipArray = ip.split(".");
    return (
      (ipArray[0] << 24) + (ipArray[1] << 16) + (ipArray[2] << 8) + +ipArray[3]
    );
  }

  function longToIp(long) {
    return (
      (long >>> 24) +
      "." +
      ((long >> 16) & 255) +
      "." +
      ((long >> 8) & 255) +
      "." +
      (long & 255)
    );
  }

  function kelipatan(count) {
    const multiples = [0];
    let currentValue = 0;

    while (currentValue <= 255) {
      const nextValue = currentValue + count;

      if (nextValue >= 255) {
        break;
      }

      multiples.push(nextValue);
      currentValue = nextValue;
    }

    return multiples;
  }

  function ipToBinary(input) {
    var chunk = input.split(".");
    var result = "";
    var x;

    for (i = 0; i < chunk.length; i++) {
      x = parseInt(chunk[i]);

      if (x > 255) {
        return false;
      }

      x = new BigNumber(x, 10).toString(2);

      while (x.length < 8) {
        x = "0" + x;
      }

      if (i < chunk.length - 1) {
        result = result + x + ".";
      } else {
        result = result + x;
      }
    }

    return result;
  }

  function getSubnetMask(cidr) {
    const subnetData = {
      A: {
        "/8": "255.0.0.0",
        "/9": "255.128.0.0",
        "/10": "255.192.0.0",
        "/11": "255.224.0.0",
        "/12": "255.240.0.0",
        "/13": "255.248.0.0",
        "/14": "255.252.0.0",
        "/15": "255.254.0.0",
      },
      B: {
        "/16": "255.255.0.0",
        "/17": "255.255.128.0",
        "/18": "255.255.192.0",
        "/19": "255.255.224.0",
        "/20": "255.255.240.0",
        "/21": "255.255.248.0",
        "/22": "255.255.252.0",
        "/23": "255.255.254.0",
      },
      C: {
        "/24": "255.255.255.0",
        "/25": "255.255.255.128",
        "/26": "255.255.255.192",
        "/27": "255.255.255.224",
        "/28": "255.255.255.240",
        "/29": "255.255.255.248",
        "/30": "255.255.255.252",
        "/31": "255.255.255.254",
      },
    };

    for (let kelas in subnetData) {
      if (subnetData[kelas][cidr]) {
        return [kelas, subnetData[kelas][cidr]];
      }
    }

    return false;
  }

  function subnetInfo(ip, subnetMask, kelas = "C") {
    const subnetInfoArray = [];
    const ckl = kelas === "A" ? 1 : kelas === "B" ? 2 : kelas === "C" ? 3 : 0;

    let done = true;
    while (done) {
      const subnet = ipToLong(ip) & ipToLong(subnetMask);
      const subnetStart = longToIp(subnet);
      const subnetEnd = longToIp(subnet | ~ipToLong(subnetMask));

      const endSubnet = parseInt(subnetEnd.split(".")[ckl]);

      subnetInfoArray.push({
        subnet: subnetStart,
        host_first: longToIp(ipToLong(subnetStart) + 1),
        host_last: longToIp(ipToLong(subnetEnd) - 1),
        broadcast: subnetEnd,
      });

      ip = longToIp(ipToLong(subnetEnd) + 1);

      if (endSubnet === 255) {
        break;
      }
    }

    return subnetInfoArray;
  }

  function dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

  $("#kembali").on("click", function (event) {
    event.preventDefault();

    window.location.href = "https://tools.mulqi.uk.to";
  });

  $("#startSubnet").on("click", function (event) {
    event.preventDefault();

    let ip = $("#ip").val();
    let cidr = "/" + $("#cidr").val();
    if (ip.length < 2 || cidr.length < 2) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Mohon isi semua Form!",
      });

      return;
    }

    $("#results").show();

    const mask = getSubnetMask(cidr);
    const kelas = mask[0];
    const subnet = mask[1];
    const subnets = subnetInfo(ip, subnet, kelas);

    // Info
    let sub, subex, biner, angka_1, angka_0, xsub, ysub, blksb, bloksub;
    if (kelas === "A") {
      subex = subnet.split(".");
      biner = ipToBinary(subnet);

      sub = biner.split(".");
      sub.shift();
      sub = sub.join(".");

      angka_1 = sub.split("1").length - 1;
      angka_0 = sub.split("0").length - 1;

      xsub = Math.pow(2, angka_1);
      ysub = Math.pow(2, angka_0) - 2;
      blksb = subex[subex.length - 3];
      bloksub = 256 - blksb;
    } else if (kelas === "B") {
      subex = subnet.split(".");
      biner = ipToBinary(subnet);

      sub = biner.split(".");
      sub.shift();
      sub.shift();
      sub = sub.join(".");

      angka_1 = sub.split("1").length - 1;
      angka_0 = sub.split("0").length - 1;

      xsub = Math.pow(2, angka_1);
      ysub = Math.pow(2, angka_0) - 2;
      blksb = subex[subex.length - 2];
      bloksub = 256 - blksb;
    } else {
      subex = subnet.split(".");
      biner = dec2bin(subex[subex.length - 1], 10).toString(2);
      angka_1 = biner.split("1").length - 1;
      angka_0 = biner.split("0").length - 1;

      xsub = Math.pow(2, angka_1);
      ysub = Math.pow(2, angka_0) - 2;
      blksb = subex[subex.length - 1];
      bloksub = 256 - blksb;
    }

    $("#infoip").val(ip);
    $("#infokelas").val(kelas);
    $("#infocidr").val(cidr);
    $("#infomask").val(subnet);
    $("#infobiner").val(biner);
    $("#infosubx").val("(2 Pangkat " + angka_1 + ") Yaitu " + xsub);
    $("#infosuby").val("(2 Pangkat " + angka_0 + ") - 2 Yaitu " + ysub);
    $("#infoblok").val("256 - " + blksb + " = " + bloksub);

    $("#dataTable").DataTable().destroy();
    const table = $("#dataTable").DataTable({
      ordering: false,
      paging: false,
    });

	table.clear();
    subnets.forEach((subnet) => {
      const columns = ["subnet", "host_first", "host_last", "broadcast"];
      table.row
        .add([
          subnet[columns[0]],
          subnet[columns[1]],
          subnet[columns[2]],
          subnet[columns[3]],
        ])
        .draw(false);
    });
    
    $(document).scrollTop($(document).height() + 500);
  });
});
