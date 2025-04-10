import { useState, useEffect } from 'react';

// Define the type for the data you're fetching
type Personality = {
  name: string;
  description: string;
  url: string;
  alt: string;
};

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [personalities, setPersonalities] = useState<Personality[]>([]); // State to store fetched data
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching data
  const [error, setError] = useState<string | null>(null); // Error state for any issues during fetch

  const hasNext = index < personalities.length - 1;
  const hasPrevious = index > 0;

  // Fetch data from the backend
  useEffect(() => {
    const fetchPersonalities = async () => {
      try {
        const response = await fetch('http://localhost:8080/acuna/personalities'); // URL of your backend API
        if (response.ok) {
          const data: Personality[] = await response.json();
          setPersonalities(data); // Set the fetched data into the state
        } else {
          setError('No data');
        }
      } catch (error) {
        setError('Error fetching personalities');
      } finally {
        setLoading(false); // Once data is fetched, stop loading
      }
    };

    fetchPersonalities();
  }, []); // This effect will run once when the component mounts

  // Handling next button click
  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  // Handling back button click
  function handleBackClick() {
    if (hasPrevious) {
      setIndex(index - 1);
    } else {
      setIndex(personalities.length - 1); // Go to the last item
    }
  }

  // Toggle the show more button
  function handleMoreClick() {
    setShowMore(!showMore);
  }

  if (loading) {
    return <div>No data</div>; // Show loading message while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there was an issue
  }

  // If no personalities are available, show a message
  if (personalities.length === 0) {
    return <div>No personalities found.</div>;
  }

  // Get the current personality data based on the index
  let currentPersonality = personalities[index];

  return (
    <>
      <h1>Rafael Francis Acuna</h1>

      <button onClick={handleBackClick}>Back</button>
      <button onClick={handleNextClick}>Next</button>

      <h2>
        <i>{currentPersonality.name}</i>
      </h2>
      <h3>
        ({index + 1} of {personalities.length})
      </h3>

      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{currentPersonality.description}</p>}

      <img
        src={currentPersonality.url}
        alt={currentPersonality.alt}
      />
    </>
  );
}
