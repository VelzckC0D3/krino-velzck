import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { Message } from '@/types/openai';
import { useThread } from './useThread';

// Remove map use to add the car functionality
/* import { useMap } from '@/context/Map'; */

// Function to fetch data from a given URL and return the JSON response.
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Custom React hook for the assistant functionality.
const useAssistant = () => {
  // State to track if the assistant is currently running a task.
  const [isRunning, setIsRunning] = useState(false);
  // Hook to interact with the map (for setting center, adding markers).
  /* const { setCenter, addMarkers } = useMap(); */
  // Hook to manage thread-related data (like threadID).
  const { threadID, resetThread } = useThread();
  // SWR hook for data fetching; it fetches messages related to a specific thread.
  const { data: messages, mutate } = useSWR<Message[]>(
    threadID ? '/api/openai/get-responses?threadID=${threadID}' : null,
    fetcher,
    {
      refreshInterval: 1000, // Automatically refreshes data every 1000 ms.
    }
  );

  // Function to send a message and trigger the assistant's actions.
  const sendMessageAndRun = useCallback(
    async (content: string, files: any[] = []) => {
      // Prevents executing if already running or if there's no threadID.
      if (isRunning || !threadID) return;

      setIsRunning(true); // Sets the running state to true.

      try {
        // Sends the user's message to the server.
        const messageRes = await fetch('/api/openai/add-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            threadID,
            content,
            files,
          }),
        });

        const message = await messageRes.json();

        // Optimistically updates the local messages state before revalidation.
        mutate(
          (currentMessages) => [
            ...(currentMessages ?? []),
            { id: message.id, role: 'user', content: [content] },
          ],
          false
        );

        // Requests to run the assistant with the current threadID.
        const run = await fetch('/api/openai/run-assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            threadID,
          }),
        });

        console.log('Run assistant response:', run); // Debugging log.

        if (!run.ok) {
          alert('Error running assistant'); // Error handling.
          return;
        }

        let runRes = await run.json();

        // Polls for the status of the assistant's task (queued, in_progress, etc.).
        while (runRes.status === 'queued' || runRes.status === 'in_progress') {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Waits for 1 second.

          const run = await fetch('/api/openai/get-run?threadID=${threadID}&runID=${runRes.id}');
          runRes = await run.json();
        }

        // Handling specific actions if the assistant requires them.
        if (runRes.status === 'requires_action') {
          const toolCalls = runRes.required_action.submit_tool_outputs.tool_calls;
          // Remove andling map updates.
          /* const updateMapToolCall = toolCalls.find((tc: any) => tc.function.name === 'update_map');
          if (updateMapToolCall) {
            const { longitude, latitude, zoom } = JSON.parse(updateMapToolCall.function.arguments);
            setCenter({ longitude, latitude, zoom });
          } */

          // Remove adding markers to the map.
          /* const markerToolCalls = toolCalls.filter((tc: any) => tc.function.name === 'add_marker');
          const markers = markerToolCalls.map((tc: any) => {
            const { longitude, latitude, label } = JSON.parse(tc.function.arguments);
            return { location: { lat: latitude, lng: longitude }, label };
          });

          addMarkers(markers);*/

          // Submitting tool output back to the server.
          await fetch('/api/openai/submit-tool-output', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              threadID,
              runID: runRes.id,
              toolOutputs: toolCalls.map((tc: any) => ({
                output: 'true',
                tool_call_id: tc.id,
              })),
            }),
          });
        }

        // Revalidating messages to fetch the latest updates.
        mutate();
      } catch (error) {
        console.error('Error sending message and running assistant:', error);
      } finally {
        setIsRunning(false); // Resets the running state.
      }
    },
    [threadID, isRunning, mutate]
  );

  // Exposing the necessary data and functions for other components.
  return { messages, sendMessageAndRun, isRunning, resetThread };
};

export default useAssistant;
