
$(document).ready(function() {

  $(".option-footer-input-inp").change(function() {

    let id = $(this).attr("id")
    if (id === "all-boules") {

      $("#green-boules").val(`${$("#all-boules").val() - $("#red-boules").val()}`)

    } else {

      if ($("#all-boules").val() - $(this).val() >= 0) {

        if (id === "red-boules") {
          $("#green-boules").val(`${$("#all-boules").val() - $("#red-boules").val()}`)

        } else if (id === "green-boules") {
          $("#red-boules").val(`${$("#all-boules").val() - $("#green-boules").val()}`)

        }

      } else {

        $("#green-boules").val("1")
        $("#red-boules").val("1")
        $(this).val(`${$("#all-boules").val() - 1}`)

      }

    }

    fillBox()
    addTextToHistory("Nouvelle boite")

  })

  $("#shuffle-button").click(function() {
    shuffleBox()
    addTextToHistory("Mélange de la boite")
  })

  $("#run-button").click(function() {
    pullBoule()
  })

  $(".run-check-button")
    .each(function() {
      let checkbox = $(this).children(".run-check-button-box")
      checkbox.prop('checked', option[$(this).attr("to-update")])
    })
    .click(function() {
      option[$(this).attr("to-update")] = !option[$(this).attr("to-update")]
    })

  addTextToHistory("Tirage initial")
  fillBox()

})

function fillBox() {

  updateChoosenBoule()

  $("#box").html("")
  clearInterval(interval)

  let nb_boules = $("#all-boules").val()
  let red_boules = $("#red-boules").val()
  let duration_of_animation = duration_of_box_filling / nb_boules

  let size = Math.sqrt(nb_boules)
  if (size%1 !== 0) {
    size = size - size%1 + 1
  }
  size = 100 / size

  let boules = []
  for (let i = 0; i<nb_boules; i++) {
    if (i < red_boules) {
      boules.push("red")
    } else {
      boules.push("green")
    }
  }
  boules = boules.sort((a, b) => 0.5 - Math.random());

  let compteur = 0;
  interval = setInterval(function() {

    if (compteur >= nb_boules) {
      clearInterval(interval)
    } else {
      $(`<div class="boule ${boules[compteur]}"> </div>`)
        .css("width", `${size}%`)
        .css("height", `${size}%`)
        .appendTo($("#box"))
    }
    compteur++;

  }, duration_of_animation * 1000)

  updatePourcent(nb_boules, nb_boules - red_boules, red_boules)

}

function updatePourcent(nb_boules, nb_green_boule, nb_red_boule) {

  if (nb_boules === undefined) {
    var nb_boules = $("#box").children(".boule").length
    var nb_green_boule = $("#box").children(".boule.green").length
    var nb_red_boule = $("#box").children(".boule.red").length
  }

  $("#green-boules-pourcent").text(`${Math.round(nb_green_boule / nb_boules * 10000) / 100}% (${nb_green_boule} / ${nb_boules})`)
  $("#red-boules-pourcent").text(`${Math.round(nb_red_boule / nb_boules * 10000) / 100}% (${nb_red_boule} / ${nb_boules})`)

}

function updateChoosenBoule() {

  if ($(".boule.hidden").length >= 1) {
    $(".boule.hidden")
      .toggleClass("hidden", false)
      .off("click")
  }

  if ($(".boule.choosen").length >= 1) {
    if (!option.avec_remise) {
      $(".boule.choosen")
        .toggleClass("choosen", false)
        .removeAttr("style")
        .toggleClass("hasbeenchoose", true)
        .appendTo("#box-history")
    } else {
      $(".boule.choosen")
        .toggleClass("choosen", false)
        .clone()
        .removeAttr("style")
        .toggleClass("hasbeenchoose", true)
        .appendTo("#box-history")
    }
  }

}

function shuffleBox() {

  updateChoosenBoule()

  boules = $("#box").children().sort((a, b) => 0.5 - Math.random());
  $("#box").html(boules)

}

function pullBoule() {

  updateChoosenBoule()

  if (option.tirage_manuel) {
    shuffleBox()
    $(".boule:not(.hasbeenchoose)")
      .toggleClass("hidden", true)
      .click(function() {
        $(".boule")
          .toggleClass("hidden", false)
          .off("click")
        animateChoosenBoule($(this))
      })
  } else {
    let choosenBouleIndex = Math.floor(Math.random() * $("#box").children().length)
    animateChoosenBoule($("#box").children().eq(choosenBouleIndex))
  }

}

function animateChoosenBoule(boule) {

  boule
    .toggleClass("choosen", true)
    .animate({
      top: "50%",
      left: "125%"
    }, "slow")

  updatePourcent()

}

function addTextToHistory(message) {

  $("#box-history")
    .append(`<p class="box-history-message"> - ${message} </p>`)

}
