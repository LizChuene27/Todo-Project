import {
	Button,
	Container,
	Text,
	Title,
	Modal,
	TextInput,
	Group,
	Card,
	ActionIcon,
	Code,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MoonStars, Sun, Trash, Edit, Checkbox } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { createTodo, getLoginUser, getTodos, deleteTodo, updateTodo } from '../../services/apiService'

export default function Todo() {
	const [formData, setFormData] = useState({
		title: '',
		summary: '',
		index: 0,
	});
	const [tasks, setTasks] = useState([]);
	const [user ] = useState(getLoginUser());
	const [opened, setOpened] = useState(false);

	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'mantine-color-scheme',
		defaultValue: 'light',
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = value =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	useHotkeys([['mod+J', () => toggleColorScheme()]]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
		  ...formData,
		  [name]: value,
		});
	  };
	

	const createTask = async () => {
		if(formData.title && formData.summary){

			if(formData.index){
				const updateTask = tasks[formData.index]
				updateTask.title = formData.title
				updateTask.summary = formData.summary
				var clonedTasks = [...tasks];
				clonedTasks.splice(formData.index, 1);
				// Update the state with the new task
				console.log("updateTask::", tasks, updateTask)
				setTasks([...clonedTasks, updateTask]);
				updateTodo(updateTask._id, updateTask);
			}else{
				const newTask = {
					title: formData.title,
					summary: formData.summary,
				};
				// Update the state with the new task
				console.log("newTask::", newTask)
				setTasks([...tasks, newTask]);
				// Create the task using your API function
				await createTodo(user._id, newTask);
				await loadTasks()
			}

			closeDailog()
		}
	}

	function deleteTask(index) {
		deleteTodo(tasks[index]._id);
		var clonedTasks = [...tasks];

		clonedTasks.splice(index, 1);

		setTasks(clonedTasks);
	}

	const loadTasks = async () => {
		try {
		  const loadedTasks = await getTodos(user._id);
		console.log('loadedTasks:',loadedTasks)
		  if (loadedTasks) {
			setTasks(loadedTasks);
		  }
		} catch (error) {
		  // Handle error
		  console.error('Error loading tasks:', error);
		}
	};

	const completeTask = async (index) => {
		const updateTask = tasks[index]
		updateTask.active = false;
		await updateTodo(updateTask._id, updateTask);
		loadTasks()
	}
	const editTask = (index) => {
		setFormData({
			title: tasks[index].title,
			summary: tasks[index].summary,
			index: index
		})
		setOpened(true);
	}

	const closeDailog = () => {
		setFormData({
			title: '',
			summary: '',
			index: 0
		})
		setOpened(false);
	}
	useEffect( () => {
		loadTasks();
	}, [user]);

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}>
			<MantineProvider
				theme={{ colorScheme, defaultRadius: 'md' }}
				withGlobalStyles
				withNormalizeCSS>
				<div className='App'>
					<Modal
						opened={opened}
						size={'md'}
						title={'New Todo'}
						withCloseButton={false}
						onClose={() => {
							setOpened(false);
						}}
						centered>
						<TextInput
							mt={'md'}
							value={formData.title}
            				onChange={handleChange}
							placeholder={'Todo Title'}
							required
							label={'Title'}
							name="title"
						/>
						<TextInput
							mt={'md'}
							placeholder={'Todo Summary'}
							value={formData.summary}
            				onChange={handleChange}
							label={'Summary'}
							name="summary"
						/>
						<Group mt={'md'} position={'apart'}>
							<Button
								onClick={closeDailog}
								variant={'subtle'}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									createTask();
									setOpened(false);
								}}>
								{formData.index ? 'UPDATE' : 'CREATE'} TODO
							</Button>
						</Group>
					</Modal>
					<Container size={550} my={40}>
						<Group position={'apart'}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
								TODO LIST
							</Title>
							<ActionIcon
								color={'blue'}
								onClick={() => toggleColorScheme()}
								size='lg'>
								{colorScheme === 'dark' ? (
									<Sun size={16} />
								) : (
									<MoonStars size={16} />
								)}
							</ActionIcon>
						</Group>
						{tasks.length > 0 ? (
							tasks.map((task, index) => {
								if (task.title) {
									return (
										<Card withBorder key={index} mt={'sm'}>
											<Group position={'apart'}>
												{
												task.active 
												? <Text weight={'bold'}>{task.title}</Text>
												: <Text weight={'bold'} style={{textDecoration: "line-through"}}>{task.title}</Text>}
												<Group position={'apart'}>
													<ActionIcon
														onClick={() => {
															deleteTask(index);
														}}
														color={'red'}
														variant={'transparent'}>
														<Trash />
													</ActionIcon>
													<ActionIcon
														disabled={!task.active}
														onClick={() => {
															editTask(index);
														}}
														color={'red'}
														variant={'transparent'}>
														<Edit />
													</ActionIcon>
													<ActionIcon
														disabled={!task.active}
														onClick={() => {
															completeTask(index);
														}}
														color={'red'}
														variant={'transparent'}>
														<Checkbox />
													</ActionIcon>
												</Group>
											</Group>
											<Text color={'dimmed'} size={'md'} mt={'sm'}>
												{task.summary
													? task.summary
													: 'No summary was provided for this todo'}
											</Text>
										</Card>
									);
								}
							})
						) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								You have no todos
							</Text>
						)}
						<Button
							onClick={() => {
								setOpened(true);
							}}
							fullWidth
							mt={'md'}>
							NEW TODO
						</Button>
					</Container>
				</div>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}



