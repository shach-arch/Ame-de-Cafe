const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("paginated-list");
const listItems = document.getElementById("list");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

console.log("here");

const paginationLimit = 10;
// const pageCount = Math.ceil(listItems.length / paginationLimit);
const pageCount = Math.ceil(888 / paginationLimit);

let currentPage;

const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);
    paginationNumbers.appendChild(pageNumber);
  };
  const getPaginationNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
      appendPageNumber(i);
    }
  };

  window.addEventListener("load", () => {
    getPaginationNumbers();
  });

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
  };

  