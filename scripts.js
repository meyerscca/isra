window.addEventListener("DOMContentLoaded", function () {
      var mobileMenuBtn = document.getElementById("mobileMenuBtn");
      var navLinks = document.getElementById("navLinks");
      var dropdowns = document.querySelectorAll("[data-dropdown]");
      var header = document.getElementById("header");

      function setMenuOpen(isOpen){
        if (!navLinks || !mobileMenuBtn) return;
        navLinks.classList.toggle("active", isOpen);
        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
        mobileMenuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
      }

      if (mobileMenuBtn){
        mobileMenuBtn.addEventListener("click", function () {
          var isOpen = navLinks && navLinks.classList.contains("active");
          setMenuOpen(!isOpen);
        });
      }

      dropdowns.forEach(function (dd) {
        var btn = dd.querySelector("button.linklike");
        if (!btn) return;

        btn.addEventListener("click", function (e) {
          e.preventDefault();
          var isOpen = dd.classList.contains("open");

          dropdowns.forEach(function (x) { x.classList.remove("open"); });
          dd.classList.toggle("open", !isOpen);

          dropdowns.forEach(function (x) {
            var b = x.querySelector("button.linklike");
            if (b) b.setAttribute("aria-expanded", String(x.classList.contains("open")));
          });
        });
      });

      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function () {
          setMenuOpen(false);
          dropdowns.forEach(function (x) { x.classList.remove("open"); });
          dropdowns.forEach(function (x) {
            var b = x.querySelector("button.linklike");
            if (b) b.setAttribute("aria-expanded", "false");
          });
        });
      });

      window.addEventListener("scroll", function () {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 10);
      });

      var revealEls = document.querySelectorAll(".reveal");

      // Safari-safe fallback: if IntersectionObserver isn't available, just show everything.
      if (!("IntersectionObserver" in window)){
        revealEls.forEach(function (el) { el.classList.add("show"); });
      } else {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if(entry.isIntersecting){
              entry.target.classList.add("show");
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });

        revealEls.forEach(function (el) { observer.observe(el); });
      }

      document.addEventListener("click", function (e) {
        var clickedInsideDropdown = e.target.closest && e.target.closest("[data-dropdown]");
        if(!clickedInsideDropdown){
          dropdowns.forEach(function (x) { x.classList.remove("open"); });
          dropdowns.forEach(function (x) {
            var b = x.querySelector("button.linklike");
            if (b) b.setAttribute("aria-expanded", "false");
          });
        }
      });
    });

window.addEventListener("load", function () {
      if (typeof Chart === "undefined") return;

      var watermark = {
        id: "watermarkYourDataHere",
        afterDraw: function(chart){
          var ctx = chart.ctx;
          var chartArea = chart.chartArea;
          if (!chartArea) return;

          var left = chartArea.left;
          var right = chartArea.right;
          var top = chartArea.top;
          var bottom = chartArea.bottom;
          var w = right - left;
          var h = bottom - top;

          ctx.save();
          ctx.globalAlpha = 0.08;
          ctx.translate(left + w/2, top + h/2);
          ctx.rotate(-Math.PI / 10);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = "900 26px Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial";
          ctx.fillText("YOUR DATA HERE", 0, 0);
          ctx.restore();
        }
      };

      Chart.register(watermark);

      var common = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(15,23,42,0.08)" } }
        }
      };

      var trendLabels = ["W1","W2","W3","W4","W5","W6","W7","W8"];
      var trendData   = [42, 46, 45, 52, 55, 54, 60, 63];

      var trendCanvas = document.getElementById("trendChart");
      if (trendCanvas){
        new Chart(trendCanvas, {
          type: "line",
          data: {
            labels: trendLabels,
            datasets: [{
              label: "Indicator",
              data: trendData,
              tension: 0.35,
              borderWidth: 3,
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: true,
              backgroundColor: "rgba(255,107,53,0.12)",
              borderColor: "rgba(255,107,53,0.95)",
              pointBackgroundColor: "rgba(255,61,127,0.95)"
            }]
          },
          options: common
        });
      }

      var donutCanvas = document.getElementById("donutChart");
      if (donutCanvas){
        new Chart(donutCanvas, {
          type: "doughnut",
          data: {
            labels: ["Segment A", "Segment B", "Segment C", "Other"],
            datasets: [{
              data: [34, 28, 22, 16],
              borderWidth: 0,
              backgroundColor: [
                "rgba(78,205,196,0.90)",
                "rgba(255,107,53,0.85)",
                "rgba(255,61,127,0.75)",
                "rgba(109,40,217,0.35)"
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: { legend: { display: false } }
          }
        });
      }

      var barCanvas = document.getElementById("barChart");
      if (barCanvas){
        new Chart(barCanvas, {
          type: "bar",
          data: {
            labels: ["Group 1","Group 2","Group 3","Group 4","Group 5"],
            datasets: [{
              label: "Score",
              data: [62, 58, 67, 54, 60],
              borderRadius: 10,
              backgroundColor: "rgba(109,40,217,0.18)",
              borderColor: "rgba(109,40,217,0.55)",
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: common.plugins,
            scales: {
              x: common.scales.x,
              y: Object.assign({}, common.scales.y, { beginAtZero: true })
            }
          }
        });
      }
    });
