import { ScreenWrapper } from "@/components/ScreenWrapper";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QuizQuestion {
  text: string;
  options: string[];
  answer: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://writermorphosis.com/wp-json/dqs/v1/quizzes");
      const data: Quiz[] = await res.json();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

//   if (loading) {
//     return (
//       <ScreenWrapper logoSource={require("../assets/images/icon.png")} title="QUIZ" showBackButton scrollable loading={false}>
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#d8d3ca" />
//         </View>
//       </ScreenWrapper>
//     );
//   }

  if (quizzes.length === 0) {
    return (
      <ScreenWrapper logoSource={require("../assets/images/icon.png")} title="QUIZ" showBackButton scrollable loading={false}>
        <View style={styles.loaderContainer}>
          <Text style={{ color: "#d8d3ca" }}>No quizzes available</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const quiz = quizzes[currentQuizIndex];
  const question = quiz.questions[currentQuestionIndex];

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
    if (option === question.answer) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < quiz.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
      }
    }, 400);
  };

  // Restart the same quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
  };

  // Move to next quiz
  const handleNextQuiz = () => {
    const nextIndex = (currentQuizIndex + 1) % quizzes.length; // Loop to first quiz if at the end
    setCurrentQuizIndex(nextIndex);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
  };

  return (
    <ScreenWrapper logoSource={require("../assets/images/icon.png")} title="QUIZ" showBackButton scrollable loading={loading}>
      <View style={styles.container}>
        {/* Quiz Title */}
        <Text style={styles.quizTitle}>{quiz.title}</Text>

        {quizCompleted ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Quiz Completed!</Text>
            <Text style={styles.resultScore}>
              You scored {score} / {quiz.questions.length}
            </Text>

            <View style={styles.resultButtons}>
              <TouchableOpacity style={styles.resultButton} onPress={handleRestartQuiz}>
                <Text style={styles.resultButtonText}>Restart Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resultButton} onPress={handleNextQuiz}>
                <Text style={styles.resultButtonText}>Next Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </Text>
            </View>

            {/* Question */}
            <Text style={styles.questionText}>{question.text}</Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {question.options.map((option) => {
                const isSelected = option === selectedOption;
                const isCorrect = option === question.answer;

                let backgroundColor = "#2a2422";
                let borderColor = "#3d3330";

                if (selectedOption) {
                  if (isSelected && isCorrect) backgroundColor = "#4CAF50";
                  else if (isSelected && !isCorrect) backgroundColor = "#F44336";
                  else if (isCorrect) backgroundColor = "#4CAF50";
                }

                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionButton, { backgroundColor, borderColor }]}
                    onPress={() => !selectedOption && handleOptionPress(option)}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d8d3ca",
    marginBottom: 20,
    textAlign: "center",
  },
  stepIndicator: {
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 6,
    backgroundColor: "#3d3330",
    borderRadius: 12,
  },
  stepText: {
    color: "#d8d3ca",
    fontWeight: "600",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#d8d3ca",
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#d8d3ca",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d8d3ca",
    marginBottom: 12,
  },
  resultScore: {
    fontSize: 20,
    color: "#d8d3ca",
    marginBottom: 20,
  },
  resultButtons: {
    flexDirection: "row",
    gap: 16,
  },
  resultButton: {
    backgroundColor: "#3d3330",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resultButtonText: {
    color: "#d8d3ca",
    fontWeight: "bold",
    fontSize: 16,
  },
});
