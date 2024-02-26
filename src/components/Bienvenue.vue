<template>
  <div class="container mt-5">
    <div class="card shadow">
      <div class="card-body">
        <h5 class="card-title" style="text-align: center">
          Liste des entreprises dans le registre de commerce Suisse
          <hr />
        </h5>

        <div class="table-container">
          <table class="table table-striped" style="width: 100%">
            <thead class="thead-fixed">
              <tr>
                <th class="align-middle">IDE</th>
                <th>Nom</th>
                <th>Adresse</th>
                <th>Forme juridique</th>
                <th>Siège</th>
                <th>Dernière modification</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="loading">
              <tr v-for="row in 8" :key="row">
                <td colspan="7" class="placeholder police_petit"></td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr
                v-for="entreprise in entreprisesapi"
                :key="entreprise.uid"
                class="police_petit"
              >
                <td @click="showModal(entreprise)" class="align-middle">
                  {{ formatUID(entreprise.uid) }}
                </td>
                <td @click="showModal(entreprise)" class="align-middle">
                  {{ entreprise.name }}
                </td>
                <td @click="showModal(entreprise)" class="align-middle">
                  {{ entreprise.adresse.street }}
                  {{ entreprise.adresse.houseNumber }}
                </td>
                <td @click="showModal(entreprise)" class="align-middle">
                  {{ entreprise.legalForm.name.fr }}
                </td>
                <td @click="showModal(entreprise)" class="align-middle">
                  {{ entreprise.legalSeat }}
                </td>
                <td @click="showModal(entreprise)" class="align-middle">
                  {{ entreprise.deletionDate }}
                </td>
                <td class="align-middle">
                  <button
                    @click="deleteEntreprise(entreprise)"
                    class="btn btn-outline-danger btn-sm police_petit"
                    :disabled="entreprise.isDeleting"
                  >
                    <i
                      v-if="!entreprise.isDeleting"
                      class="fas fa-trash-alt"
                    ></i>
                    <i v-else class="fas fa-spinner fa-spin"></i>
                    {{ entreprise.isDeleting ? "Suppression" : "Supprimer" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <div
          class="table-container"
          style="text-align: center; border-top: 3px solid #ddd"
        >
          <table class="table table-striped">
            <tbody>
              <tr>
                <td>
                  <div class="input-group mb-3">
                    <span class="input-group-text police_petit">CHE</span>
                    <input
                      type="text"
                      v-model="companyIde"
                      class="form-control police_petit"
                      placeholder="XXX-XXX-XXX"
                      aria-label=""
                      aria-describedby="basic-addon1"
                      @input="formatInput"
                    />
                  </div>
                </td>
                <td>
                  <div class="input-group mb-3">
                    <input
                      v-model="companyName"
                      type="text"
                      class="form-control police_petit"
                      placeholder="Nom"
                      aria-label=""
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </td>
                <td>
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      v-model="companyAddress"
                      class="form-control police_petit"
                      placeholder="Adresse complet"
                      aria-label=""
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </td>
                <td>
                  <div class="input-group mb-3">
                    <select
                      class="custom-select police_petit"
                      v-model="companyStatus"
                    >
                      <option value="(inconnu)" selected>(inconnu)</option>
                      <option
                        v-for="legalStatue in legalStatus"
                        :key="legalStatue.id"
                        :value="legalStatue.name.fr"
                      >
                        {{ legalStatue.name.fr }}
                      </option>
                    </select>
                  </div>
                </td>
                <td>
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      class="form-control police_petit"
                      placeholder="Siège"
                      v-model="companySeat"
                      aria-label=""
                      aria-describedby="basic-addon1"
                    />
                  </div>
                </td>
                <td>
                  <p>
                    <button
                      @click="postData"
                      :class="buttonClass"
                      :disabled="!isSubmitEnabled"
                      class="btn btn-lg police_petit"
                    >
                      <i
                        v-if="!isSubmitting"
                        class="fa-solid fa-circle-plus fa-beat"
                      ></i>
                      <i v-else class="fas fa-spinner fa-spin"></i>
                      {{ isSubmitting ? "Enregistrement" : "Ajouter" }}
                    </button>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br />
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      :class="{ show: showModalFlag }"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Mise à jour des données
            </h5>
          </div>
          <div class="modal-body">
            <table class="table" style="border: 0px solid rgb(255, 255, 255)">
              <tbody>
                <tr>
                  <td>IDE</td>
                  <td>
                    <div class="input-group mb-3">
                      <input
                        type="text"
                        v-model="companyIde_Update"
                        class="form-control"
                        placeholder="XXX-XXX-XXX"
                        aria-label=""
                        aria-describedby="basic-addon1"
                        @input="formatInput"
                        disabled="true"
                      />
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>Nom</td>
                  <td>
                    <div class="input-group mb-3">
                      <input
                        v-model="companyName_Update"
                        type="text"
                        class="form-control"
                        placeholder="Nom"
                        aria-label=""
                        aria-describedby="basic-addon1"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Adresse</td>

                  <td>
                    <div class="input-group mb-3">
                      <input
                        type="text"
                        v-model="companyAddress_Update"
                        class="form-control"
                        placeholder="Adresse complet"
                        aria-label=""
                        aria-describedby="basic-addon1"
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Forme</td>

                  <td>
                    <div class="input-group mb-3">
                      <select
                        class="custom-select"
                        v-model="companyStatus_Update"
                      >
                        <option selected>(inconnu)</option>
                        <option
                          v-for="legalStatue in legalStatus"
                          :key="legalStatue.id"
                          :value="legalStatue.name.fr"
                        >
                          {{ legalStatue.name.fr }}
                        </option>
                      </select>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Siège</td>

                  <td>
                    <div class="input-group mb-3">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Siège"
                        v-model="companySeat_Update"
                        aria-label=""
                        aria-describedby="basic-addon1"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-dismiss="modal"
              @click="hideModal"
            >
              Fermer
            </button>
            <button
              type="button"
              @click="updateData()"
              :class="buttonClass"
              class="btn btn-outline-success"
            >
              <i v-if="!isSubmitting" class="fa-solid fa-sync"></i>
              <i v-else class="fas fa-sync fa-spin"></i>
              {{ isSubmitting ? "Mise à jour" : "Sauvegarder" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import { ref, onMounted, computed } from "vue";
import EntrepriseService from "@/services/EntrepriseService";

export default {
  name: "HomeView",
  setup() {
    const entreprisesapi = ref([]);
    const legalStatus = ref([]);
    const loading = ref(true);
    const companyIde = ref("");
    const companyName = ref("");
    const companyAddress = ref("");
    const companyStatus = ref("");
    const companySeat = ref("");
    const companyIde_Update = ref("");
    const companyName_Update = ref("");
    const companyAddress_Update = ref("");
    const companyStatus_Update = ref("");
    const companySeat_Update = ref("");
    const isSubmitting = ref(false);
    const showModalFlag = ref(false);

    const showModal = (entreprise) => {
      showModalFlag.value = true;

      companyIde_Update.value = formatUID(entreprise.uid);
      companyName_Update.value = entreprise.name;
      companyAddress_Update.value = entreprise.adresse.street;
      companyStatus_Update.value = entreprise.legalForm.name.fr;
      companySeat_Update.value = entreprise.legalSeat;
    };

    const hideModal = () => {
      showModalFlag.value = false;
    };

    const fetchEntreprisesapi = async () => {
      loading.value = true;
      try {
        const response = await EntrepriseService.getAllEntreprisesApi();
        entreprisesapi.value = response.data;
      } catch (error) {
        console.error("Error fetching entreprises:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchStatus = async () => {
      loading.value = true;
      try {
        const response = await EntrepriseService.getAllStatus();
        legalStatus.value = response.data;
      } catch (error) {
        console.error("Error fetching entreprises:", error);
      } finally {
        loading.value = false;
      }
    };

    var dateJour = new Date();
    const postData = async () => {
      try {
        isSubmitting.value = true;
        const dataToSend = {
          uid: "CHE" + companyIde.value.split("-").join(""),
          name: companyName.value,
          adresse: {
            street: companyAddress.value,
            houseNumber: "",
          },
          legalForm: {
            id: 0,
            uid: "string",
            name: {
              de: "",
              fr: companyStatus.value,
              it: "",
              en: "",
            },
            shortName: {
              de: "de",
              fr: "fr",
              it: "it",
              en: "en",
            },
          },
          legalSeat: companySeat.value,
          deletionDate: `${dateJour.getDate()}-${
            dateJour.getMonth() + 1
          }-${dateJour.getFullYear()} ${dateJour.getHours()}:${dateJour.getMinutes()}:${dateJour.getSeconds()}`,
        };

        const response = await EntrepriseService.insertNewRecord(dataToSend, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data == false) {
          alert("Cet élément existe déjà");
          isSubmitting.value = false;
        } else {
          console.log("Post request response:", response.data);

          const newData = await EntrepriseService.getAllEntreprisesApi();

          entreprisesapi.value = newData.data;
          isSubmitting.value = false;

          clearInputFields();
        }
      } catch (error) {
        console.error("Error making POST request:", error);
      }
    };

    const deleteEntreprise = async (entreprise) => {
      const result = confirm(
        `Confirmez-vous la suppression de l'enregistrement N°${formatUID(
          entreprise.uid
        )} ?`
      );
      if (result) {
        try {
          entreprise.isDeleting = true;

          await EntrepriseService.deleteEntreprise(entreprise.uid);

          const newData = await EntrepriseService.getAllEntreprisesApi();

          entreprisesapi.value = newData.data;

          entreprise.isDeleting = false;
        } catch (error) {
          alert("Cet élément ne peux pas être supprimé." + error);
          entreprise.isDeleting = false;
          console.log(error);
        }
      }
    };

    const updateData = async () => {
      const formatIde = reverseFormatUID(companyIde_Update.value);
      try {
        isSubmitting.value = true;
        const dataToSend = {
          name: companyName_Update.value,
          address: companyAddress_Update.value,
          legalForm: companyStatus_Update.value,
          legalSeat: companySeat_Update.value,
          deletionDate: `${dateJour.getDate()}-${
            dateJour.getMonth() + 1
          }-${dateJour.getFullYear()} ${dateJour.getHours()}:${dateJour.getMinutes()}:${dateJour.getSeconds()}`,
        };

        const response = await EntrepriseService.updateEntreprise(
          formatIde,
          dataToSend
        );

        console.log("Post request response:", response.data);

        const newData = await EntrepriseService.getAllEntreprisesApi();

        entreprisesapi.value = newData.data;
        isSubmitting.value = false;
        hideModal();
      } catch (error) {
        console.error("Error making PUT request:", error);
        isSubmitting.value = false;
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    };

    const formatUID = (uid) => {
      const numericPart = uid.replace(/\D/g, "");
      return numericPart.replace(/(\d{3})(\d{3})(\d{3})/, "CHE-$1-$2-$3");
    };
    const reverseFormatUID = (formattedUID) => {
      return formattedUID.replace(/-/g, "");
    };

    const formatInput = () => {
      companyIde.value = companyIde.value.replace(/[^0-9]/g, "");
      companyIde.value = companyIde.value.substring(0, 9);

      let formattedValue = "";

      for (let i = 0; i < companyIde.value.length; i++) {
        if (i > 0 && (i === 3 || i === 6)) {
          formattedValue += "-";
        }
        formattedValue += companyIde.value[i];
      }

      companyIde.value = formattedValue;
    };

    const clearInputFields = () => {
      companyIde.value = "";
      companyName.value = "";
      companyAddress.value = "";
      companyStatus.value = "";
      companySeat.value = "";
    };

    const buttonClass = {
      "btn btn-outline-primary btn-md": !isSubmitting.value,
      "btn btn-secondary btn-md": isSubmitting.value,
    };

    const isSubmitEnabled = computed(() => {
      return companyIde.value.length === 11;
    });

    onMounted(async () => {
      await fetchStatus();
      await fetchEntreprisesapi();
    });

    return {
      entreprisesapi,
      legalStatus,
      deleteEntreprise,
      loading,
      companyIde,
      companyAddress,
      companyName,
      companyStatus,
      companySeat,
      companyIde_Update,
      companyAddress_Update,
      companyName_Update,
      companyStatus_Update,
      companySeat_Update,
      postData,
      updateData,
      formatInput,
      clearInputFields,
      isSubmitting,
      buttonClass,
      isSubmitEnabled,
      showModal,
      hideModal,
      showModalFlag,
      formatUID,
      reverseFormatUID,
    };
  },
};
</script>

<style scoped>
.dataTables_filter input {
  width: 200px;
  margin-right: 10px;
}
.my-custom-class {
  margin-right: 10px;
}
.table-container table {
  width: 100%;
}

tr {
  cursor: pointer;
}

.police_petit {
  font-size: 12px;
}
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 500px;
}

.show {
  display: flex;
  justify-content: center;
  flex-direction: row;
}

.placeholder {
  height: 45px;
  width: 100%;
  background-color: #f0f0f0;
  animation: loading-animation 1.5s infinite;
  display: table-cell;
}

@keyframes loading-animation {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

.table-container {
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.table-container::-webkit-scrollbar {
  width: 2px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #3498db;
  border-radius: 6px;
}

.table-container::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

.thead-fixed {
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 100;
  transition: background-color 0.3s ease;
  text-align: left;
  line-height: 1.5;
  padding: 8px;
  font-size: 12px;
}

.thead-fixed th:hover {
  background-color: #f0f0f0;
}
</style>
