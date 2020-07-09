const API_ROOT = "https://ih-crud-api.herokuapp.com/characters/";

const charListTbody = document.getElementById("characterList");
const idParagraph = document.getElementById("characterId");
const nameParagraph = document.getElementById("characterName");
const isInDebtParagraph = document.getElementById("characterIsInDebt");
const occupationParagraph = document.getElementById("characterOccupation");
const weaponParagraph = document.getElementById("characterWeapon");

// Form

const form = document.getElementById("characterForm");

// Funções do CRUD
const crudFactory = () => ({
  async listCharacters() {
    try {
      const characterList = await axios.get(API_ROOT);
      console.log(characterList);
      return characterList.data;
    } catch (err) {
      return err;
    }
  },
  async saveCharacter(data) {
    // Operação idempotente

    const { id } = data;

    try {
      const character = await axios.get(API_ROOT + id, {
        validateStatus: false,
      });

      if (character.data.error) {
        return await axios.post(API_ROOT, { ...data, id: undefined });
      }

      return await axios.patch(API_ROOT + character.data.id, data);
    } catch (err) {
      console.log(err);
    }
  },
  async deleteCharacter(id) {
    try {
      const result = await axios.delete(API_ROOT + id);
      return result;
    } catch (err) {
      return err;
    }
  },
});

async function fetchCharacters() {
  try {
    const charList = await crudFactory().listCharacters();

    // Necessário iterar na mesma array uma vez para criar o HTML e outra vez para registrar os event listeners, pois aqui, quando destruímos o HTML anterior, destruímos também os listeners que estavam registrados nele

    if (charListTbody.children.length) {
      charListTbody.innerHTML = "";
    }

    charList.forEach((character) => {
      charListTbody.innerHTML += `
        <tr id="${character.name}">
          <td>${character.id}</td>
          <td>${character.name}</td>
          <td><button class="btn btn-danger btn-sm" type="button" id="deleteBtn-${character.id}">Delete</button></td>
        </tr>
      `;
    });

    charList.forEach((character) => {
      // Ao clicar em um personagem, ver os detalhes dele

      document.getElementById(character.name).addEventListener("click", () => {
        idParagraph.innerHTML = character.id;
        nameParagraph.innerHTML = character.name;
        isInDebtParagraph.innerHTML = character.debt ? "Yes" : "No";
        occupationParagraph.innerHTML = character.occupation;
        weaponParagraph.innerHTML = character.weapon;
      });

      // Deletar personagem
      document
        .getElementById("deleteBtn-" + character.id)
        .addEventListener("click", async () => {
          try {
            await crudFactory().deleteCharacter(character.id);
          } catch (err) {
            throw new Error(err);
          }

          fetchCharacters();
        });
    });
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

// Ao carregar a página, listar os personagens
window.addEventListener("load", fetchCharacters);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = {};

  for (let input of event.target) {
    formData[input.id] = input.value;
  }

  try {
    const result = await crudFactory().saveCharacter(formData);
    fetchCharacters();
  } catch (err) {
    console.log(err);
  }
});

// Ao clicar em Submit, criar ou atualizar um personagem
