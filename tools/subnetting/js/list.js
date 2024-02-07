$(document).ready(function () {
  Swal.fire({
    title: "Informasi",
    html: "Sebelum Memulai, Mohon maaf jika ada data yang salah, karena Project Ini hanya dikerjakan untuk Membantu Pekerjaan Tugas saya disekolah saja :)<br/><br/>Oleh Muhamad Mulqi (XI TKJ-B)",
    icon: "info",
  });

  let cidrTable = $('[name="cidrTable"]');
  cidrTable.DataTable().destroy();
  let cidrTables = cidrTable.DataTable({
    ordering: false,
    paging: false,
  });

  cidrTables.clear();
  for (let i = 8; i <= 31; i++) {
    let cidr = "/" + i;
    const mask = getSubnetMask(cidr);
    const kelas = mask[0];
    const subnet = mask[1];
    const subi = getSubnetInfo(subnet, kelas);
    cidrTables.row
      .add([cidr, subnet, subi[0], subi[3], subi[4], subi[6]])
      .draw(false);
  }
});
