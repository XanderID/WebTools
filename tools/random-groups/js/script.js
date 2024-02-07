$(document).ready(function () {
  function getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has(param)) {
      return urlParams.get(param);
    } else {
      return false;
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  function bagiKelompok(list, jumlah, khusus) {
    let kelompok = [];
    let index = 1; // Index Kelompok

    if (khusus.length > 1) {
      kelompok[0] = [...khusus];
    }

    for (let i = 0; i <= list.length - 1; i++) {
      if (index >= jumlah) {
        if (khusus.length > 1) {
          if (kelompok[1].length >= khusus.length) {
            index = 0;
          } else {
            index = 1;
          }
        } else {
          index = 0;
        }
      }

      let nama = list[i];

      if (!khusus.includes(nama)) {
        if (!kelompok[index]) {
          kelompok[index] = [];
        }
        kelompok[index].push(nama);
        index++;
      }
    }

    kelompok[0] = shuffleArray(kelompok[0]);
    return kelompok;
  }

  function hex2a(hex) {
    var str = "";
    for (var i = 0; i < hex.length; i += 2) {
      var v = parseInt(hex.substr(i, 2), 16);
      if (v) str += String.fromCharCode(v);
    }
    return str;
  }

  function getRandomColor() {
    let colors = [
      "primary",
      "warning",
      "secondary",
      "success",
      "info",
      "danger",
      "dark",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function flipCards() {
    $(".flip-card").addClass("flip");

    setTimeout(function () {
      if ($(".flip-card").hasClass("flip")) {
        $(".flip-card").removeClass("flip");
      }
    }, 1000);
  }

  function toggleRadio(radios, on, form) {
    $.each(radios, function (index, id) {
      $("#" + id).prop("checked", false);
      if (form) {
        $("#" + id + "form").hide();
      }
    });

    $("#" + on).prop("checked", true);
    if (form) $("#" + on + "form").show();
  }

  // Switch ON OFF
  let type = "dgnnama";
  let anim = "dgnanimasi";
  toggleRadio(["dgnnama", "dgnabsen"], type, true);
  toggleRadio(["dgnanimasi", "tanpaanimasi"], anim, false);

  $("#dgnnama, #dgnabsen").on("change", function () {
    let id = $(this).attr("id");
    toggleRadio(["dgnnama", "dgnabsen"], id, true);
    type = id;
  });

  $("#dgnanimasi, #tanpaanimasi").on("change", function () {
    let id = $(this).attr("id");
    toggleRadio(["dgnanimasi", "tanpaanimasi"], id);
    anim = id;
  });

  // Get Saved Url
  if (getParam("names") !== false) {
    let paramNames = getParam("names").split(";").join("\n");
    $("#namamurid").val(paramNames);
  }

  if (getParam("jumlah") !== false) {
    let paramNames = parseInt(getParam("jumlah"));
    if (!isNaN(paramNames)) {
      $("#jumlah").val(paramNames);
    }
  }

  if (getParam("type") !== false) {
    let paramNames = getParam("type");
    if (paramNames == "dgnabsen") {
      type = paramNames;
      toggleRadio(["dgnnama", "dgnabsen"], type, true);
    } else {
      type = "dgnnama";
      toggleRadio(["dgnnama", "dgnabsen"], type, true);
    }
  }
  if (getParam("absen") !== false) {
    let paramNames = getParam("absen").split("-");
    let min = parseInt(paramNames[0]);
    let max = parseInt(paramNames[1]);
    if (!isNaN(min) && !isNaN(max)) {
      $("#startabsen").val(min);
      $("#endabsen").val(max);
    }
  }

  // End Saved Url

  $("#results").hide();

  $("#kembali").on("click", function (event) {
    event.preventDefault();

    window.location.href = "https://tools.mulqi.uk.to";
  });

  $("#saveGroup").on("click", function (event) {
    event.preventDefault();

    let temp = $("<input>");
    let textGroups = "https://tools.mulqi.uk.to/tools/random-groups/?";
    textGroups += "type=" + type + "&jumlah=" + $("#jumlah").val();
    if (type == "dgnnama") {
      textGroups += "&names=" + $("#namamurid").val().split("\n").join(";");
    } else {
      textGroups +=
        "&absen=" + $("#startabsen").val() + "-" + $("#endabsen").val();
    }

    $("body").append(temp);
    temp.val(encodeURI(textGroups)).select();
    document.execCommand("copy");
    temp.remove();

    Swal.fire({
      title: "Copied",
      html: "Link dengan Nama-Nama Anggota Kelas Berhasil DiCopy",
      icon: "success",
    });
  });

  $("#startGroup").on("click", function (event) {
    event.preventDefault();

    let listNames, kelompok;
    if (type === "dgnnama") {
      listNames = $("#namamurid").val().split("\n");
      if (listNames.length < 2) {
        Swal.fire({
          title: "Error",
          html: "Mohon Masukan Minimal 2 Orang",
          icon: "error",
        });

        return;
      }
    } else {
      if ($("#startabsen").val() === "" || $("#endabsen").val() === "") {
        Swal.fire({
          title: "Error",
          html: "Mohon Masukan Nomor DiMulai nya absen dan Absen Terakhir!",
          icon: "error",
        });
        return;
      }

      let startAbsen = parseInt($("#startabsen").val());
      let endAbsen = parseInt($("#endabsen").val());

      listNames = [];
      for (let i = startAbsen; i <= endAbsen; i++) {
        listNames.push(i);
      }

      if (listNames.length < 2) {
        Swal.fire({
          title: "Error",
          html: "Mohon Masukan Minimal 2 Orang",
          icon: "error",
        });

        return;
      }
    }

    kelompok = parseInt($("#jumlah").val());
    if (isNaN(kelompok) || kelompok < 2) {
      Swal.fire({
        title: "Error",
        html: "Mohon Masukan Minimal 2 Kelompok",
        icon: "error",
      });

      return;
    }

    if (kelompok > listNames.length) {
      Swal.fire({
        title: "Error",
        html: `Mohon Maaf tapi ${listNames.length} Orang tidak bisa dibagi menjadi ${kelompok} Kelompok`,
        icon: "error",
      });

      return;
    }

    $("#results").show();
    let listGroups = [];
    let khusus = [];
    let today = "d" + new Date().getDate();

    // Custom Team Dengan Uri &tanggal=(Text sama dengan ListNames tapi dengan hex)
    if (getParam(today) !== false) {
      let paramNames = hex2a(getParam(today), "hex");
      khusus = paramNames.split(";");
      if (khusus.length < 2) {
        khusus = [];
      }
    }

    // Start The Randomize
    for (let i = 0; i <= Math.floor(Math.random() * 11); i++) {
      listGroups = shuffleArray(
        bagiKelompok(shuffleArray(listNames), kelompok, khusus),
      );
    }
    listGroups.sort((a, b) => b.length - a.length);

    let hasilGroup = $("#hasilGroup");
    hasilGroup.empty();

    $.each(listGroups, function (key, value) {
      let randomColor = getRandomColor();
      let keyup = parseInt(key) + 1;
      let cardHtml = `
    <div class="col-6" id="kelompok-${keyup}-card">
        <div class="card border-top-lg border-${randomColor} mb-4 flip-card">
            <div class="card-body">
                <div class="text-center">
                    <div class="m-0 font-weight-bold text-${randomColor}">
                        Kelompok<br />
                        <span id="kelompok-${keyup}-title">${keyup}</span>
                    </div>
                </div>
                <div id="kelompok-${keyup}-member">
                    ${value
                      .map((member) =>
                        type === "dgnabsen"
                          ? "Absen " + member + "<br />"
                          : member.length > 8
                            ? "<u>" + member + "</u><br />"
                            : member + "<br />",
                      )
                      .join("")}
                </div>
            </div>
        </div>
    </div>
`;

      hasilGroup.append(cardHtml);
    });

    $(document).scrollTop($(document).height() + 500);
    flipCards();

    // Start Animation
    if (anim == "dgnanimasi") {
      let animation = setInterval(function () {
        flipCards();
        listGroups = shuffleArray(
          bagiKelompok(shuffleArray(listNames), kelompok, khusus),
        );
        listGroups.sort((a, b) => b.length - a.length);
        setTimeout(function () {
          $.each(listGroups, function (key, value) {
            let keyup = parseInt(key) + 1;
            let card = $(`#kelompok-${keyup}-member`);
            card.html(
              `${value
                .map((member) =>
                  type === "dgnabsen"
                    ? "Absen " + member + "<br />"
                    : member.length > 8
                      ? "<u>" + member + "</u><br />"
                      : member + "<br />",
                )
                .join("")}`,
            );
          });
        }, 500);
      }, 1500);
      setTimeout(function () {
        clearInterval(animation);
      }, 1000 * 5);
    }
  });
});
