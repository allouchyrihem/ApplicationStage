import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";

const Profile = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${userData.address}&limit=1`
      );
      const { coordinates } = response.data.features[0].geometry;
      const [lon, lat] = coordinates;
      
      const distance = getDistanceFromLatLonInKm(lat, lon, 48.8566, 2.3522);
      if (distance > 50) {
        alert("L'adresse est à plus de 50 km de Paris.");
        return;
      }

      console.log("Utilisateur mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la validation de l'adresse :", error);
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; 
    return d;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  return (
    session ? (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Prénom"
          value={userData.lastName}
          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
        />
        <input
          type="date"
          placeholder="Date de naissance"
          value={userData.dateOfBirth}
          onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
        />
        <input
          type="text"
          placeholder="Adresse"
          value={userData.address}
          onChange={(e) => setUserData({ ...userData, address: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Numéro de téléphone"
          value={userData.phone}
          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
        />
        <button type="submit">Mettre à jour</button>
      </form>
    ) : (
      <p>Veuillez vous connecter pour accéder à votre profil.</p>
    )
  );
};

export default Profile;
