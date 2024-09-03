import Header from '../components/Header';

const currentPath = "/evaluation"; 

export default function Evaluation() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 p-4 bg-white text-black">
        <h1>Evaluation Method:</h1>
        User can enter a question and expected answer, based on the saved results from the playground, the user can evaluate the similarity and accuracy of the answer.
      </main>
    </div>
  );
}