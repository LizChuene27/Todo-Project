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
    Badge
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MoonStars, Sun, Trash, Edit, Eye } from 'tabler-icons-react';

import {
	MantineProvider,
	ColorSchemeProvider,
	ColorScheme,
} from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { getUsers, getLoginUser, deleteUser } from '../../services/apiService'

export default function Users() {
	
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

	
	

	function deleteTask(index) {
		deleteUser(tasks[index]._id);
		var clonedTasks = [...tasks];

		clonedTasks.splice(index, 1);

		setTasks(clonedTasks);
	}

	const loadTasks = async () => {
		try {
		  const users = await getUsers();
		console.log('users:',users)
		  if (users) {
			setTasks(users);
		  }
		} catch (error) {
		  // Handle error
		  console.error('Error loading users:', error);
		}
	};


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
					<Container size={550} my={40}>
						<Group position={'apart'}>
							<Title
								sx={theme => ({
									fontFamily: `Greycliff CF, ${theme.fontFamily}`,
									fontWeight: 900,
								})}>
								Users LIST
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
								if (task.username) {
									return (
										<Card withBorder key={index} mt={'sm'}>
											<Group position={'apart'}>
                                                <Text weight={'bold'}>{task.username}  
                                                   {task.email && <Badge badgeContent={4} color="error" style={{marginLeft: 20}}>{task.email}</Badge>} 
                                                </Text>
												<Group position={'apart'}>
													<ActionIcon
														onClick={() => {
															deleteTask(index);
														}}
														color={'red'}
														variant={'transparent'}>
														<Trash />
													</ActionIcon>
												</Group>
											</Group>
										</Card>
									);
								}
							})
						) : (
							<Text size={'lg'} mt={'md'} color={'dimmed'}>
								You have no users
							</Text>
						)}
					</Container>
				</div>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}



