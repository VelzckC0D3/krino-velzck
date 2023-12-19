import { useCallback, useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { Message } from '@/types/openai';
import { useThread } from './useThread';
import { useCar } from '@/context/Cars';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useAssistant = () => {
  console.log('Initializing useAssistant hook');
  const [isRunning, setIsRunning] = useState(false);
  const { addCar } = useCar();
  const { threadID, resetThread } = useThread();
  const { data: messages, mutate } = useSWR<Message[]>(
    threadID ? `/api/openai/get-responses?threadID=${threadID}` : null,
    fetcher,
    { refreshInterval: 1000 }
  );

  const messageQueue = useRef([]);

  const processMessageQueue = useCallback(() => {
    if (messageQueue.current.length > 0 && !isRunning) {
      const nextMessage = messageQueue.current.shift();
      sendMessageAndRun(nextMessage.content, nextMessage.files);
    }
  }, [isRunning]);

  useEffect(() => {
    processMessageQueue();
  }, [isRunning, processMessageQueue]);

  const checkRunStatus = async (runID) => {
    let runRes = await fetch(`/api/openai/get-run?threadID=${threadID}&runID=${runID}`).then(
      (res) => res.json()
    );
    while (runRes.status === 'queued' || runRes.status === 'in_progress') {
      console.log('Waiting for run to complete');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runRes = await fetch(`/api/openai/get-run?threadID=${threadID}&runID=${runID}`).then((res) =>
        res.json()
      );
    }
    return runRes;
  };

  const sendMessageAndRun = useCallback(
    async (content: string, files: any[] = []) => {
      console.log('sendMessageAndRun called', { content, files, isRunning, threadID });
      if (!threadID) {
        console.log('No threadID available');
        return;
      }

      if (isRunning) {
        messageQueue.current.push({ content, files });
        return;
      }

      setIsRunning(true);
      const timeoutId = setTimeout(() => {
        setIsRunning(false);
      }, 5000); // Set state to complete after 5 seconds

      try {
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
        if (message.error) {
          throw new Error(message.error);
        }

        console.log('Message response received', message);

        mutate(
          (currentMessages) => [
            ...(currentMessages ?? []),
            { id: message.id, role: 'user', content: [content] },
          ],
          false
        );

        const run = await fetch('/api/openai/run-assistant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ threadID }),
        });

        if (!run.ok) {
          const runRes = await run.json();
          throw new Error(runRes.error || 'Error running assistant');
        }

        let runRes = await run.json();
        console.log('Run response received', runRes);

        runRes = await checkRunStatus(runRes.id);

        if (runRes.status === 'requires_action') {
          console.log('Action required by run', runRes);
          const addCarToolCalls = runRes.required_action.submit_tool_outputs.tool_calls.filter(
            (tc: any) => tc.function.name === 'update_car'
          );
          addCarToolCalls.forEach((tc: any) => {
            const carData = JSON.parse(tc.function.arguments);
            console.log('Adding car from tool call', carData);
            addCar(carData);
          });
        }
      } catch (error) {
        console.error('Error in sendMessageAndRun', error);
      } finally {
        clearTimeout(timeoutId);
        setIsRunning(false);
        processMessageQueue();
      }
    },
    [threadID, isRunning, mutate, addCar]
  );

  return { messages, sendMessageAndRun, isRunning, resetThread };
};

export default useAssistant;
