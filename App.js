import {
  StatusBar,
  Modal,
  View,
  Image,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Alert } from "react-native";

export default function App() {
  const [isFontLoaded, setFontLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [Equipe1, setEquipe1] = useState(require("./images/empty.png"));
  const [Equipe2, setEquipe2] = useState(require("./images/empty.png"));
  const [QuelleEquipe, setQuelleEquipe] = useState(0);
  const [NameEquipe1, setNameEquipe1] = useState("Home");
  const [NameEquipe2, setNameEquipe2] = useState("Away");
  const [ProbaVictoireEquipe1, setProbaVictoireEquipe1] = useState("0");
  const [ProbaVictoireEquipe2, setProbaVictoireEquipe2] = useState("0");
  const [EquipeGagnante, setEquipeGagnante] = useState(null);
  const [PourcentageChance, setPourcentageChance] = useState(0);
  const [Fiabilite, setFiabilite] = useState(0);
  const [modeCoupeDuMonde, setModeCoupeDuMonde] = useState(false);

  const handleModeCoupeDuMondeToggle = () => {
    if (NameEquipe2 === "France") {
      Alert.alert(
        "Warning",
        "You cannot activate World Cup mode if the French team is playing away."
      );
    } else {
      setModeCoupeDuMonde(!modeCoupeDuMonde);
      calculateProbabilities(NameEquipe1, NameEquipe2);
    }
  };

  useEffect(() => {
    calculateProbabilities(NameEquipe1, NameEquipe2);
  }, [modeCoupeDuMonde, NameEquipe1, NameEquipe2]);

  CoteTeam1 = isFinite(0 / ProbaVictoireEquipe1)
    ? 100 / ProbaVictoireEquipe1
    : 0;
  CoteTeam2 = isFinite(0 / ProbaVictoireEquipe2)
    ? 100 / ProbaVictoireEquipe2
    : 0;

  const handleImageClick = (imagePath) => {
    let equipe1 = NameEquipe1;
    let equipe2 = NameEquipe2;

    if (QuelleEquipe === 1) {
      if (imagePath === Equipe2) {
        Alert.alert("Warning", "Teams cannot be the same.");
        return;
      }

      if (modeCoupeDuMonde && Equipe2 === "France") {
        Alert.alert(
          "Warning",
          "The French team cannot be selected as an away team in World Cup mode."
        );
        return;
      }

      setEquipe1(imagePath);
      equipe1 = imageTexts[imagePaths.indexOf(imagePath)];
      setNameEquipe1(equipe1);
    } else if (QuelleEquipe === 2) {
      if (
        modeCoupeDuMonde &&
        imageTexts[imagePaths.indexOf(imagePath)] === "France"
      ) {
        Alert.alert(
          "Warning",
          "The French team cannot be selected as an away team in World Cup mode."
        );
        return;
      }

      if (imagePath === Equipe1) {
        Alert.alert("Warning", "Teams cannot be the same.");
        return;
      }

      setEquipe2(imagePath);
      equipe2 = imageTexts[imagePaths.indexOf(imagePath)];
      setNameEquipe2(equipe2);
    }
    setModalVisible(false);
    calculateProbabilities(equipe1, equipe2);
  };

  const calculateProbabilities = (equipe1, equipe2) => {
    const rugbyData = require("./rugby_data.json");
    const today = new Date();
    let neutral = modeCoupeDuMonde;

    if (modeCoupeDuMonde && equipe1 === "France") {
      neutral = false;
    }

    let totalMatchs = 0;
    let nbMatchs = 0;
    let victoiresEquipe1 = 0;
    let victoiresEquipe2 = 0;

    for (const match of rugbyData) {
      const homeTeam = match.home_team;
      const awayTeam = match.away_team;
      const homeScore = match.home_score;
      const awayScore = match.away_score;
      const matchDate = new Date(match.date);
      const differenceAnnees = today.getFullYear() - matchDate.getFullYear();

      let poidsMatch = 0.5;

      if (differenceAnnees <= 2) {
        poidsMatch = 7;
      } else if (differenceAnnees <= 5) {
        poidsMatch = 4;
      } else if (differenceAnnees <= 10) {
        poidsMatch = 2;
      }

      if (!neutral) {
        if (homeTeam === equipe1 && homeScore > awayScore) {
          victoiresEquipe1 += poidsMatch;
          totalMatchs += poidsMatch;
          nbMatchs++;
        } else if (awayTeam === equipe2 && awayScore > homeScore) {
          victoiresEquipe2 += poidsMatch;
          totalMatchs += poidsMatch;
          nbMatchs++;
        }
      } else {
        if (
          (homeTeam === equipe1 && homeScore > awayScore) ||
          (awayTeam === equipe1 && awayScore > homeScore)
        ) {
          victoiresEquipe1 += poidsMatch;
          totalMatchs += poidsMatch;
          nbMatchs++;
        } else if (
          (homeTeam === equipe2 && homeScore > awayScore) ||
          (awayTeam === equipe2 && awayScore > homeScore)
        ) {
          victoiresEquipe2 += poidsMatch;
          totalMatchs += poidsMatch;
          nbMatchs++;
        }
      }
    }

    if (totalMatchs > 0) {
      const probaVictoireEquipe1 = (victoiresEquipe1 / totalMatchs) * 100;
      const probaVictoireEquipe2 = (victoiresEquipe2 / totalMatchs) * 100;
      const fiabilite = totalMatchs / 100;

      let equipeGagnante, pourcentageChance;

      if (probaVictoireEquipe1 > probaVictoireEquipe2) {
        equipeGagnante = equipe1;
        pourcentageChance = probaVictoireEquipe1;
      } else {
        equipeGagnante = equipe2;
        pourcentageChance = probaVictoireEquipe2;
      }

      setProbaVictoireEquipe1(probaVictoireEquipe1.toFixed(1));
      setProbaVictoireEquipe2(probaVictoireEquipe2.toFixed(1));
      setEquipeGagnante(equipeGagnante);
      setPourcentageChance(pourcentageChance.toFixed(1));
      setFiabilite(fiabilite.toFixed(2));
    } else {
      setProbaVictoireEquipe1(0);
      setProbaVictoireEquipe2(0);
      setEquipeGagnante(null);
      setPourcentageChance(0);
      setFiabilite(0);
    }
  };

  const handleInversion = () => {
    if (modeCoupeDuMonde) {
      Alert.alert("Warning", "Teams cannot be reversed in World Cup mode.");
    } else {
      const tempEquipe1 = Equipe1;
      const tempNameEquipe1 = NameEquipe1;

      setEquipe1(Equipe2);
      setNameEquipe1(NameEquipe2);

      setEquipe2(tempEquipe1);
      setNameEquipe2(tempNameEquipe1);

      calculateProbabilities(NameEquipe2, NameEquipe1);
    }
  };

  const imagePaths = [
    require("./images/FranceFlag.png"),
    require("./images/AngleterreFlag.png"),
    require("./images/ArgentineFlag.png"),
    require("./images/AustralieFlag.png"),
    require("./images/EcosseFlag.png"),
    require("./images/IrlandeFlag.png"),
    require("./images/ItalyFlag.png"),
    require("./images/NewZealandFlag.png"),
    require("./images/SouthAfricaFlag.png"),
    require("./images/WalesFlag.png"),
  ];

  const imageTexts = [
    "France",
    "England",
    "Argentina",
    "Australia",
    "Scotland",
    "Ireland",
    "Italy",
    "New Zealand",
    "South Africa",
    "Wales",
  ];

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "Colosseum-Bold": require("./assets/fonts/Colosseum-Bold.otf"),
        "Colosseum-Medium": require("./assets/fonts/Colosseum-Medium.otf"),
        "Colosseum-Light": require("./assets/fonts/Colosseum-Light.otf"),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);

  if (!isFontLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.redContainer}>
        <Image
          source={require("./images/background.png")}
          style={{ flex: 1, width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
      <View style={styles.blueContainer}>
        <Image
          source={require("./images/fond_cup.png")}
          style={styles.backgroundImage}
        />
        <View style={styles.blueTop}></View>
        <View style={styles.blueBottomTop}>
          <TouchableWithoutFeedback onPress={handleInversion}>
            <Text style={styles.inversionButton}>Swap Teams</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={handleModeCoupeDuMondeToggle}>
            <Text style={styles.inversionButton}>
              World Cup mode : {modeCoupeDuMonde ? "Enabled" : "Disabled"}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.blueMiddle}>
          <View style={styles.additionalMiddlePart}>
            <Image
              source={require("./images/logo.png")}
              style={{ flex: 1, width: "100%", height: "100%" }}
              resizeMode="center"
            />
          </View>
        </View>
        <View style={styles.blueBottom}>
          <View style={styles.blueBottomMiddle}>
            <View style={styles.subPart4}>
              <Text style={styles.texte}>{CoteTeam1.toFixed(1)}</Text>
            </View>
            <View style={styles.subPart5}>
              <Text style={styles.texte}>Estimated odds</Text>
            </View>
            <View style={styles.subPart6}>
              <Text style={styles.texte}>{CoteTeam2.toFixed(1)}</Text>
            </View>
          </View>
          <View style={styles.blueBottomBottom}>
            <View style={styles.greenSubContainer3}>
              <Text style={styles.titres2}>Win probability</Text>
            </View>
            <View style={styles.greenSubContainer4}>
              <Text style={styles.pourcentage1}>{ProbaVictoireEquipe1}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressBarLeft,
                    { flex: Math.round(ProbaVictoireEquipe1) },
                  ]}
                ></View>
                <View
                  style={[
                    styles.progressBarRight,
                    { flex: Math.round(ProbaVictoireEquipe2) },
                  ]}
                ></View>
              </View>
              <Text style={styles.pourcentage2}>{ProbaVictoireEquipe2}%</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.overlayContainer}>
        <View style={styles.greenSubContainer}>
          <Text style={styles.titres2}>Rugby World Cup 2023</Text>
        </View>
        <View style={styles.greenSubContainer2}>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(true);
              setQuelleEquipe(1);
            }}
          >
            <View style={styles.subPart1}>
              <View style={styles.subPartTop1}>
                <Image
                  source={Equipe1}
                  style={{ flex: 1, width: "100%", height: "100%" }}
                  resizeMode="center"
                />
              </View>
              <View style={styles.subPartBottom1}>
                <Text style={styles.titres}>{NameEquipe1}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.subPart2}>
            <Image
              source={require("./images/vs.png")}
              style={{ flex: 1, width: "100%", height: "100%" }}
              resizeMode="center"
            />
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(true);
              setQuelleEquipe(2);
            }}
          >
            <View style={styles.subPart3}>
              <View style={styles.subPartTop3}>
                <Image
                  source={Equipe2}
                  style={{ flex: 1, width: "100%", height: "100%" }}
                  resizeMode="center"
                />
              </View>
              <View style={styles.subPartBottom3}>
                <Text style={styles.titres}>{NameEquipe2}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <StatusBar style="auto" />
      <StatusBar style="auto" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback
          activeOpacity={1}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Select a Team</Text>
            <ScrollView>
              {imagePaths.map((path, i) => (
                <TouchableWithoutFeedback
                  key={i}
                  onPress={() => handleImageClick(path)}
                >
                  <View
                    style={[
                      styles.imageItem,
                      { marginTop: 15 },
                      { marginLeft: 25 },
                    ]}
                  >
                    <View style={styles.imageContainer}>
                      <Image
                        source={path}
                        style={{ width: 85, height: 50 }}
                        resizeMode="cover"
                      />
                      <Text style={styles.imageText}>{imageTexts[i]}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeaderText: {
    fontFamily: "Colosseum-Medium",
    fontSize: 18,
    margin: 5,
    textAlign: "center",
  },

  inversionButton: {
    fontFamily: "Colosseum-Medium",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  progressBar: {
    flexDirection: "row",
    width: "45%",
    height: "30%",
    backgroundColor: "#FF3000",
    borderRadius: 30,
    overflow: "hidden",
  },
  pourcentage1: {
    textAlign: "right",
    width: "28%",
    fontFamily: "Colosseum-Medium",
    fontSize: 28,
    marginHorizontal: "5%",
  },
  pourcentage2: {
    width: "28%",
    fontFamily: "Colosseum-Medium",
    fontSize: 28,
    marginHorizontal: "5%",
  },

  progressBarLeft: {
    backgroundColor: "#2D3CFF",
    borderRadius: 30,
  },

  progressBarRight: {
    backgroundColor: "#FF3000",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  titres: {
    fontFamily: "Colosseum-Bold",
    fontSize: 13,
    textAlign: "center",
  },
  titres2: {
    fontFamily: "Colosseum-Bold",
    fontSize: 20,
  },
  texte: {
    fontFamily: "Colosseum-Medium",
    fontSize: 16,
  },
  redContainer: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  blueContainer: {
    flex: 6,
  },
  backgroundImage: {
    position: "absolute",
    marginLeft: -250,
    width: "200%",
    height: "200%",
  },
  blueTop: {
    height: "17%",
    alignItems: "center",
    justifyContent: "center",
  },
  blueMiddle: {
    height: "35%",
    alignItems: "center",
    justifyContent: "center",
  },
  additionalMiddlePart: {
    height: "100%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  blueBottom: {
    height: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  blueBottomTop: {
    height: "10%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  blueBottomMiddle: {
    height: "22%",
    width: "100%",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#E9E9E9",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  blueBottomBottom: {
    backgroundColor: "#FFFFFF",
    height: "56%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayContainer: {
    position: "absolute",
    top: "30%",
    left: "5%",
    width: "90%",
    height: "20%",
    backgroundColor: "#F6F6F6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    borderRadius: 30,
  },
  greenSubContainer: {
    width: "90%",
    height: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  greenSubContainer3: {
    width: "85%",
    height: "25%",
    alignItems: "left",
    justifyContent: "center",
  },
  greenSubContainer4: {
    flexDirection: "row",
    width: "85%",
    height: "60%",
    marginTop: "2%",
    alignItems: "center",
    justifyContent: "center",
  },
  greenSubContainer2: {
    flexDirection: "row",
    marginTop: "2%",
    width: "90%",
    height: "60%",
    alignItems: "top",
    justifyContent: "center",
  },
  subPart1: {
    marginRight: "6%",
    width: "25%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPartTop1: {
    height: "80%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPartBottom1: {
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPart2: {
    width: "25%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPart4: {
    marginRight: "5%",
    width: "25%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPart5: {
    width: "30%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPart6: {
    marginLeft: "5%",
    width: "25%",
    height: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPart3: {
    marginLeft: "6%",
    width: "25%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPartTop3: {
    height: "80%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  subPartBottom3: {
    height: "20%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    marginBottom: 30,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderColor: "#2D3CFF",
    overflow: "hidden",
    marginTop: "146%",
    backgroundColor: "#F6F6F6",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  imageItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageText: {
    fontFamily: "Colosseum-Bold",
    fontSize: 16,
    marginLeft: 10,
  },
});
