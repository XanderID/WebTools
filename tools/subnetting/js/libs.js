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

function getSubnetInfo(subnet, kelas) {
  const classMap = {
    A: { subc: 1, subm: 3 },
    B: { subc: 2, subm: 2 },
    C: { subc: 3, subm: 1 },
  };

  const { subc, subm } = classMap[kelas] || { subc: 0, subm: 0 };
  const biner = ipToBinary(subnet).split(".");
  const angka_1 = biner.slice(subc).join("").split("1").length - 1;
  const angka_0 = biner.slice(subc).join("").split("0").length - 1;

  const xsub = Math.pow(2, angka_1);
  const ysub = Math.pow(2, angka_0) - 2;
  const blksb = subnet.split(".")[subnet.split(".").length - subm];
  const bloksub = 256 - blksb;

  return [biner.join("."), angka_1, angka_0, xsub, ysub, blksb, bloksub];
}

function subnetInfo(ip, subnetMask, kelas = "C") {
  const subnetInfoArray = [];
  const ckl = kelas === "A" ? 1 : kelas === "B" ? 2 : kelas === "C" ? 3 : 0;

  while (true) {
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

function subnetInfoVLSM(baseIPString, cidr, networks, useExplanation) {
  networks.sort((a, b) => b.amount - a.amount);

  let baseIP = baseIPString.split(".").map(Number);
  let subnetMask = cidr;
  let results = [];

  for (let i = 0; i < networks.length; i++) {
    const network = networks[i];

    const subnetSize = Math.pow(2, Math.ceil(Math.log2(network.amount + 2)));

    const lastIP = baseIP[3] + subnetSize - 1;

    const subnetInfo = {
      name: network.name,
      networkAddress: `${baseIP.join(".")}/${32 - Math.log2(subnetSize)}`,
      range: `${baseIP[0]}.${baseIP[1]}.${baseIP[2]}.${baseIP[3] + 1} - ${
        baseIP[0]
      }.${baseIP[1]}.${baseIP[2]}.${lastIP - 1}`,
      broadcastAddress: `${baseIP[0]}.${baseIP[1]}.${baseIP[2]}.${lastIP}`,
      neededSize: network.amount,
      allocatedSize: subnetSize,
      address: `${baseIP[0]}.${baseIP[1]}.${baseIP[2]}.${baseIP[3] + 1}`,
      decMask: 32 - Math.log2(subnetSize),
    };

    if (useExplanation) {
      subnetInfo.cara = `${
        network.amount
      } ≤ 2<sup>n</sup> – 2 (untuk menentukan 2<sup>n</sup> hasil harus lebih besar dari host)<div class="mt-1">
${network.amount} ≤ 2<sup>${Math.ceil(
        Math.log2(network.amount + 2),
      )}</sup> – 2</div><div class="mt-1">
${network.amount} ≤ ${subnetSize} – 2</div><div class="mt-1">
${network.amount} ≤ ${subnetSize - 2}</div>`;
    }

    results.push(subnetInfo);

    baseIP[3] += subnetSize;
  }

  return results;
}
