document.getElementById("addTaskBtn").addEventListener("click", function() {
  const titleInput = document.getElementById("taskTitle");
  const descInput = document.getElementById("taskDesc");
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";

  const titleEl = document.createElement("h3");
  titleEl.textContent = title;

  const descEl = document.createElement("p");
  descEl.textContent = description;

  const btnContainer = document.createElement("div");
  btnContainer.className = "task-buttons";

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Mark as Completed";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  btnContainer.appendChild(completeBtn);
  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);

  taskDiv.appendChild(titleEl);
  taskDiv.appendChild(descEl);
  taskDiv.appendChild(btnContainer);

  document.getElementById("taskList").appendChild(taskDiv);

  // Clear inputs
  titleInput.value = "";
  descInput.value = "";

  // Mark as Completed toggle
  completeBtn.addEventListener("click", function() {
    taskDiv.classList.toggle("completed");
    if (taskDiv.classList.contains("completed")) {
      completeBtn.textContent = "Mark as Incomplete";
    } else {
      completeBtn.textContent = "Mark as Completed";
    }
  });

  // Delete task
  deleteBtn.addEventListener("click", function() {
    taskDiv.remove();
  });

  // Edit task
  editBtn.addEventListener("click", function() {
    if (editBtn.textContent === "Edit") {
      const editTitle = document.createElement("input");
      editTitle.type = "text";
      editTitle.value = titleEl.textContent;

      const editDesc = document.createElement("textarea");
      editDesc.value = descEl.textContent;

      taskDiv.insertBefore(editTitle, titleEl);
      taskDiv.insertBefore(editDesc, descEl);
      taskDiv.removeChild(titleEl);
      taskDiv.removeChild(descEl);

      editBtn.textContent = "Save";

      editBtn.addEventListener("click", function saveEdit() {
        if (editBtn.textContent === "Save") {
          titleEl.textContent = editTitle.value.trim();
          descEl.textContent = editDesc.value.trim();
          taskDiv.insertBefore(titleEl, editTitle);
          taskDiv.insertBefore(descEl, editDesc);
          taskDiv.removeChild(editTitle);
          taskDiv.removeChild(editDesc);
          editBtn.textContent = "Edit";
          editBtn.removeEventListener("click", saveEdit);
        }
      });
    }
  });
});
