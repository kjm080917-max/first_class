// FRANCHISE 페이지: 공통 모바일 메뉴, 상담 신청 폼, 맨 위로 이동
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".site-header__toggle");

if (header && toggle) {
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    header.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
}

// 연락처 입력: 숫자만 허용하고 입력 칸이 채워지면 다음 칸으로 이동
const phoneInputs = [
  document.querySelector("#phone-first"),
  document.querySelector("#phone-middle"),
  document.querySelector("#phone-last")
].filter(Boolean);

phoneInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    const maxLength = Number(input.maxLength);
    input.value = input.value.replace(/\D/g, "").slice(0, maxLength);
    if (input.value.length === maxLength && phoneInputs[index + 1]) {
      phoneInputs[index + 1].focus();
    }
    clearError("phone");
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && input.value === "" && phoneInputs[index - 1]) {
      phoneInputs[index - 1].focus();
    }
  });

  input.addEventListener("paste", (event) => {
    event.preventDefault();
    const pasted = (event.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
    let remaining = pasted;
    phoneInputs.forEach((field) => {
      const length = Number(field.maxLength);
      field.value = remaining.slice(0, length);
      remaining = remaining.slice(length);
    });
    const nextEmpty = phoneInputs.find((field) => field.value.length < field.maxLength);
    (nextEmpty || phoneInputs[2]).focus();
    clearError("phone");
  });
});

const form = document.querySelector("#franchise-form");
if (form) {
  const feedback = document.querySelector("#inquiry-feedback");
  const submitButton = form.querySelector(".inquiry-submit");
  let isSubmitting = false;

  function showError(key, message, fields) {
    const error = document.querySelector("#" + key + "-error");
    if (error) error.textContent = message;
    fields.forEach((field) => {
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", key + "-error");
    });
  }

  function clearError(key, fields = []) {
    const error = document.querySelector("#" + key + "-error");
    if (error) error.textContent = "";
    fields.forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    });
  }

  const nameInput = document.querySelector("#applicant");
  const regionInput = document.querySelector("#region");
  const budgetInput = document.querySelector("#budget");
  const consentInput = document.querySelector("#privacy-consent");

  [nameInput, regionInput, budgetInput].forEach((input) => {
    input.addEventListener("input", () => clearError(input.id, [input]));
  });
  consentInput.addEventListener("change", () => clearError("consent", [consentInput]));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    feedback.textContent = "";
    let firstInvalid = null;
    const markInvalid = (key, message, fields, focusTarget = fields[0]) => {
      showError(key, message, fields);
      if (!firstInvalid) firstInvalid = focusTarget;
    };

    clearError("applicant", [nameInput]);
    clearError("region", [regionInput]);
    clearError("budget", [budgetInput]);
    clearError("phone", phoneInputs);
    clearError("consent", [consentInput]);

    if (!nameInput.value.trim()) {
      markInvalid("applicant", "성명을 입력해 주세요.", [nameInput]);
    }

    const phone = phoneInputs.map((input) => input.value);
    const phoneIsValid = /^01[016789]$/.test(phone[0]) &&
      /^\d{3,4}$/.test(phone[1]) &&
      /^\d{4}$/.test(phone[2]) &&
      (phone.join("").length === 10 || phone.join("").length === 11);

    if (!phoneIsValid) {
      const firstEmpty = phoneInputs.find((input) => input.value.length < input.maxLength);
      markInvalid("phone", "연락처를 숫자로 정확히 입력해 주세요.", phoneInputs, firstEmpty || phoneInputs[0]);
    }

    if (!regionInput.value.trim()) {
      markInvalid("region", "창업희망지역을 입력해 주세요.", [regionInput]);
    }
    if (!budgetInput.value.trim()) {
      markInvalid("budget", "창업예산을 입력해 주세요.", [budgetInput]);
    }
    if (!consentInput.checked) {
      markInvalid("consent", "개인정보 수집 및 이용에 동의해 주세요.", [consentInput]);
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const application = {
      name: nameInput.value.trim(),
      phone: phone.join("-"),
      source: document.querySelector("#source").value,
      region: regionInput.value.trim(),
      budget: budgetInput.value.trim(),
      privacyConsent: consentInput.checked
    };

    // TODO: 실제 서비스 오픈 전 상담 신청 API 또는 관리 시트 연동 필요
    console.log("[가맹 상담 신청]", application);

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "접수 처리 중...";
    feedback.textContent = "온라인 접수 기능은 아직 연결되지 않았습니다. 전화 상담을 이용해 주세요.";

    window.setTimeout(() => {
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = "상담신청하기";
      form.reset();
      phoneInputs.forEach((input) => input.removeAttribute("aria-invalid"));
    }, 900);
  });
}

const topButton = document.querySelector(".to-top");
if (topButton) {
  const updateTopButton = () => topButton.classList.toggle("is-show", window.scrollY > 600);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}
