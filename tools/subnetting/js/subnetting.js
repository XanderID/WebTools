$(document).ready(function () {
  let jumlahHost = 0;
  function hideAll() {
    $("#results").hide();
    $("#resultsvslm").hide();
    $("#dgncara").hide();
    $("#dgncaravslm").hide();
    $("#vslmtext").hide();
  }

  hideAll();
  $("#vslmform").hide();

  Swal.fire({
    title: "Informasi",
    html: "Sebelum Memulai, Mohon maaf jika ada data yang salah, karena Project Ini hanya dikerjakan untuk Membantu Pekerjaan Tugas saya disekolah saja :)<br/><br/>Oleh Muhamad Mulqi (XI TKJ-B)",
    icon: "info",
  });

  $("#kembali").on("click", function (event) {
    event.preventDefault();

    window.location.href = "https://tools.mulqi.my.id";
  });

  $("#metodeVSLM").on("click", function (event) {
    if ($(this).is(":checked")) {
      $("#vslmform").show();
      $("#vslmtext").show();
      return;
    }

    $("#vslmform").hide();
    $("#vslmtext").hide();
  });

  $(document).on("click", "#addNewHost", function (event) {
    event.preventDefault();
    jumlahHost++;
    let newInputGroup = `
        <div class="input-group input-group-joined mt-2" id="vslm-${jumlahHost}">
          <input class="form-control rounded-0" type="text" id="hostn-${jumlahHost}" placeholder="Host Name"/>
          <input class="form-control" type="number" id="hosta-${jumlahHost}" placeholder="Amount"/>
          <button class="btn btn-primary rounded-0" id="addNewHost" type="button"><i class="fa-solid fa-plus"></i></button>
          <button class="btn btn-danger rounded-0" id="removeHost" type="button"><i class="fa-solid fa-minus"></i></button>
        </div>`;
    $("#vslmfin").append(newInputGroup);
    $(this).hide();
  });

  $(document).on("click", "#removeHost", function (event) {
    event.preventDefault();
    if (jumlahHost > 0) {
      $(this).closest(".input-group").remove();
      jumlahHost--;

      $("#vslmfin div:last #addNewHost").show();
    }
  });

  $("#startSubnet").on("click", function (event) {
    event.preventDefault();
    hideAll();

    let ip = $("#ip").val();
    let cidr = parseInt($("#cidr").val());
    if (ip.length < 2 || cidr < 2) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Mohon isi IP dan CIDR!",
      });

      return;
    }

    if ($("#metodeVSLM").is(":checked")) {
      let networksList = [];
      $("#vslmfin .input-group-joined").each(function () {
        let hostName = $(this).find('input[id^="hostn-"]').val();
        let amount = parseInt($(this).find('input[id^="hosta-"]').val());
        if (hostName.length > 0 && amount > 0) {
          networksList.push({ name: hostName, amount: amount });
        }
      });

      if (networksList.length < 2) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Minimal 2 Host untuk Metode VSLM",
        });
        return;
      }

      let results = subnetInfoVLSM(ip, cidr, networksList, true);

      $("#resultsvslm").show();
      let vslmTable = $('[name="subnetTableVSLM"]');
      vslmTable.DataTable().destroy();
      const vslTable = vslmTable.DataTable({
        ordering: false,
        paging: false,
      });

      vslTable.clear();
      let count = 1;
      let caratext = ``;
      results.forEach((vslm) => {
        vslTable.row
          .add([
            vslm["name"],
            vslm["neededSize"],
            vslm["allocatedSize"],
            vslm["address"],
            vslm["decMask"],
            vslm["range"],
            vslm["broadcastAddress"],
          ])
          .draw(false);

        caratext += `<div>${count}. ${vslm["name"]}: ${vslm["neededSize"]} Host
    <div class="ml-4">${vslm["cara"]}</div>
  </div>`;
        count++;
      });

      if ($("#dengancara").is(":checked")) {
        $("#dgncaravslm").show();
        $("#dgncaravslmtext").append(caratext.trim());
      }
    } else {
      const mask = getSubnetMask("/" + cidr);
      const kelas = mask[0];
      const subnet = mask[1];
      const subnets = subnetInfo(ip, subnet, kelas);

      if ($("#dengancara").is(":checked")) {
        $("#dgncara").show();
        const subi = getSubnetInfo(subnet, kelas);

        // Info
        $("#infoip").val(ip);
        $("#infokelas").val(kelas);
        $("#infocidr").val(cidr);
        $("#infomask").val(subnet);
        $("#infobiner").val(subi[0]);
        $("#infosubx").val("(2 Pangkat " + subi[1] + ") Yaitu " + subi[3]);
        $("#infosuby").val("(2 Pangkat " + subi[2] + ") - 2 Yaitu " + subi[4]);
        $("#infoblok").val("256 - " + subi[5] + " = " + subi[6]);
      }

      $("#results").show();
      let subnetTable = $('[name="subnetTable"]');
      subnetTable.DataTable().destroy();
      const subTable = subnetTable.DataTable({
        ordering: false,
        paging: false,
      });

      subTable.clear();
      subnets.forEach((subnet) => {
        const columns = ["subnet", "host_first", "host_last", "broadcast"];
        subTable.row
          .add([
            subnet[columns[0]],
            subnet[columns[1]],
            subnet[columns[2]],
            subnet[columns[3]],
          ])
          .draw(false);
      });
    }

    $(document).scrollTop($(document).height() + 500);
  });
});
